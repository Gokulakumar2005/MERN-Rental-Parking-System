
import { useSelector } from "react-redux";
import { useState } from "react";
import { UpdateProfile } from "../slices/authSlices";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import axios from "../config/axiosInstance.jsx";

export default function () {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [updateForm, setUpdateForm] = useState({
        id: user?._id,
        userName: user?.userName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [Error, setError] = useState({});
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const handleChange = (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value })
    }

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!updateForm.userName.trim()) {
            errors.userName = "UserName is Required";
        }
        if (!updateForm.email.trim()) {
            errors.email = "Email is Required";
        }
        if (!updateForm.phoneNumber.trim()) {
            errors.phoneNumber = "Phone Number is Required";
        }
        if (Object.keys(errors).length !== 0) {
            setError(errors);
            return;
        }

        const formData = new FormData();

        formData.append("id", updateForm.id);
        formData.append("userName", updateForm.userName);
        formData.append("email", updateForm.email);
        formData.append("phoneNumber", updateForm.phoneNumber);

        if (image) {
            formData.append("profilePic", image);
        }

        console.log({"inside the Profile Component ":formData})
        dispatch(UpdateProfile({formData})).then(() => {
            setShowUpdateForm(false);
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            return setPasswordError("All fields are required.");
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return setPasswordError("New password and confirm password do not match.");
        }

        try {
            const response = await axios.put("/update/password", {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            }, {
                headers: { Authorization: localStorage.getItem("token") }
            });
            setPasswordSuccess("Password updated successfully!");
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => {
                setShowPasswordForm(false);
                setPasswordSuccess("");
            }, 2000);
        } catch (err) {
            setPasswordError(err.response?.data?.error || "Error updating password");
        }
    }


    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Profile Page</h2>
            
            {!showUpdateForm && !showPasswordForm ? (
                <div className="flex flex-col items-center space-y-6">
                    <img
                        src={user?.profilePic || "https://via.placeholder.com/150"} 
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-blue-50"
                    />
                    <div className="w-full space-y-4 px-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-medium">Name</span>
                            <span className="text-lg text-gray-800 font-semibold">{user?.userName}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-medium">Email</span>
                            <span className="text-lg text-gray-800 font-semibold">{user?.email}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-medium">Phone Number</span>
                            <span className="text-lg text-gray-800 font-semibold">{user?.phoneNumber}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full sm:space-x-4 space-y-3 sm:space-y-0 mt-6 px-4">
                        <button 
                            onClick={() => setShowUpdateForm(true)}
                            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md transform hover:-translate-y-0.5"
                        >
                            Update Profile
                        </button>
                        <button 
                            onClick={() => setShowPasswordForm(true)}
                            className="flex-1 bg-red-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 transition duration-300 shadow-md transform hover:-translate-y-0.5"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            ) : showUpdateForm ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <div>
                        <label>Profile Pic</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src={preview || user?.profilePic || "https://via.placeholder.com/100"} 
                            alt="Profile"
                            className="w-20 h-20 object-cover rounded-full shadow-md border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={handleEditClick}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                        >
                            Edit
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-left block text-gray-700 font-medium mb-1">
                        UserName :
                    </label>
                    <input
                        type="text"
                        value={updateForm.userName}
                        name="userName"
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    {Error.userName && (
                        <span className="text-red-500 text-sm block mt-1 text-left">
                            {Error.userName}
                        </span>
                    )}
                </div>
                <div>
                    <label className=" text-left block text-gray-700 font-medium mb-1">
                        Email :
                    </label>
                    <input
                        type="email"
                        value={updateForm.email}
                        name="email"
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    {Error.email && (
                        <span className="text-red-500 text-sm block mt-1 text-left">
                            {Error.email}
                        </span>
                    )}
                </div>
                <div>
                    <label className="text-left block text-gray-700 font-medium mb-1">
                        Phone Number :
                    </label>
                    <input
                        type="text"
                        value={updateForm.phoneNumber}
                        name="phoneNumber"
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                    {Error.phoneNumber && (
                        <span className="text-red-500 text-sm block mt-1 text-left">
                            {Error.phoneNumber}
                        </span>
                    )}
                </div>
                <div className="flex space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setShowUpdateForm(false);
                            setError({});
                        }}
                        className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl hover:bg-gray-500 transition duration-300"
                    >
                        Cancel
                    </button>
                    <input
                        type="submit"
                        value="Save Changes"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-300 cursor-pointer shadow-md"
                    />
                </div>
            </form>
            ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Reset Password</h3>
                    
                    {passwordError && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center font-medium border border-red-200">
                            {passwordError}
                        </div>
                    )}
                    {passwordSuccess && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-center font-medium border border-green-200">
                            {passwordSuccess}
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowPasswordForm(false);
                                setPasswordError("");
                                setPasswordSuccess("");
                                setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                            }}
                            className="w-full bg-gray-400 text-white font-semibold py-3 rounded-xl hover:bg-gray-500 transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition duration-300 cursor-pointer shadow-md"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

// user
// :
// createdAt
// :
// "2026-04-03T10:07:16.161Z"
// email
// :
// "vendor1@gmail.com"
// password
// :
// "$2b$10$L8SRjpkbW.XYcVVWF.9ZaOZIgPZV6ZNnwU/pbQpiC76201FUQHNZG"
// phoneNumber
// :
// "9944351752"
// role
// :
// "vendor"
// updatedAt
// :
// "2026-04-03T10:47:41.729Z"
// userName
// :
// "vendor1"
// wallet
// :
// 640
// __v
// :
// 0
// _id
// :
// "69cf9153f7e186fb9a8f562d"