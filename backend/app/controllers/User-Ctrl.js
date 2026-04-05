
import UserModel from "../models/UserModel.js";
import { UserValidation, LoginValidation } from "../validations/userValidation.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// import otp-generator from "otp-generator";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import nodemailer from "nodemailer";

import axios from "axios";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const UserCtrl = {};

UserCtrl.googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await UserModel.findOne({ email });

        if (!user) {
            // Check if this is the first user (admin)
            const usersCount = await UserModel.countDocuments();
            const role = usersCount === 0 ? 'admin' : 'user';

            user = new UserModel({
                userName: name,
                email: email,
                role: role,
                profilePic: picture,
                wallet: 0,
                // password and phoneNumber are optional now
            });
            await user.save();
        }

        const tokenData = { userId: user._id, role: user.role };
        const jwtToken = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "7d" });

        res.json({ token: jwtToken });
    } catch (error) {
        console.log("Google Login Error:", error.message);
        res.status(400).json({ error: "Google authentication failed" });
    }
}

UserCtrl.register = async (req, res) => {
    const body = req.body;
    // console.log(body);
    const { error, value } = UserValidation.validate(body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) })
    }
    try {
        const UserPresentWithEmail = await UserModel.findOne({ email: value.email });
        if (UserPresentWithEmail) {
            return res.status(400).json({ error: "email already present" })
        }
        else {
            const user = new UserModel(value);
            const salt = await bcryptjs.genSalt();
            const hashpassword = await bcryptjs.hash(value.password, salt);
            user.password = hashpassword;
            const usersCount = await UserModel.countDocuments();
            if (usersCount == 0) {
                user.role = 'admin'
            }
            user.wallet = 0;
            await user.save();

            res.json(user);
        }

    } catch (error) {
        console.log(error.message)
    }

}
UserCtrl.login = async (req, res) => {
    const body = req.body;
    const { error, value } = LoginValidation.validate(body, { abortEarly: false })
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) })
    }
    const userPresent = await UserModel.findOne({ email: value.email })
    if (!userPresent) {
        return res.json({ error: "invalid Email" })
    }
    const password = await bcryptjs.compare(value.password, userPresent.password);
    if (!password) {
        return res.json({ error: "Invalid Password" })
    }
    // generate JWT Token 
    const tokenData = { userId: userPresent._id, role: userPresent.role };
    const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "7d" });
    res.json({ token: token })
}


UserCtrl.account = async (req, res) => {
    try {
        const users = await UserModel.findById(req.userId)
        res.json(users);

    } catch (err) {
        console.log(err.message)
    }
}

UserCtrl.updateProfile = async (req, res) => {
    const Id = req.params.id
    const body = req.body;

    if (req.file && req.file.path) {
        body.profilePic = req.file.path;
    }

    // console.log({ "body": body, "Id": Id });
    try {
        const response = await UserModel.findByIdAndUpdate(Id, { $set: body }, { new: true })
        // console.log(response);
        res.json(response);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}


UserCtrl.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect Old Password" });

        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashPassword;
        await user.save();

        res.json({ message: "Password updated successfully", user });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
}

UserCtrl.forgotPassword = async (req, res) => {
    const body = req.body.detail;
    console.log({ "BOdy inside the Forgot Ctrl": body });
    try {
        const response = await UserModel.findOne({ $or: [{ email: body }, { phoneNumber: body }] });
        if (!response) {
            return res.status(404).json({ message: "Invalid user details" });
        }
        // console.log(response);
        const parts = body.split(',').map((ele) => ele.trim());

        const sendtogmail = parts.find((ele) => ele.includes("gmail.com"));

        const sendtotwillo = parts.find((ele) => /^[6-9]\d{9}$/.test(ele));

        console.log({ gmail: sendtogmail });
        console.log({ SMS: sendtotwillo });

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            numeric: true
        });
        console.log({ "generated OPT ": otp });

        if (sendtogmail !== undefined) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER, // Need to set EMAIL_USER and EMAIL_PASS if not present
                    pass: process.env.EMAIL_PASS
                }
            });

            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: sendtogmail,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is ${otp}. It is strictly confidential.`
            };

            await transporter.sendMail(mailOptions);
            console.log('OTP sent to email successfully');
            return res.json({ "BackendOPT": otp });
        }

        if (sendtotwillo !== undefined) {
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_TOKEN;

            const client = twilio(accountSid, authToken);
            const formattedNumber = `+91${sendtotwillo}`;
            console.log({ "formattedNumber": formattedNumber })

            async function sendOtp(formattedNumber, otp) {
                await client.messages.create({
                    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
                    from: process.env.TWILIO_PHONE_NO,
                    to: formattedNumber
                });

                console.log('OTP sent successfully');
                return res.json({ "BackendOPT": otp });
            }

            await sendOtp(formattedNumber, otp);
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

UserCtrl.resetPassword = async (req, res) => {
    const { detail, newPassword } = req.body;
    try {
        const user = await UserModel.findOne({ $or: [{ email: detail }, { phoneNumber: detail }] });
        if (!user) return res.status(404).json({ error: "User not found" });

        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
}
UserCtrl.switchRole = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.role = user.role == "user" ? "vendor" : "user";
        await user.save();
        res.json({ message: "Role updated successfully", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}
export default UserCtrl;