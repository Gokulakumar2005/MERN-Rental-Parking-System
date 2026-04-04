
import { useState } from "react";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../slices/authSlices.jsx";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [FormData, setFormData] = useState({
        userName: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        wallet:0
    })

    const [Error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(null);


    const handleChange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value })
    }

    const redirect = () => {
        navigate("/login");
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        if (FormData.password !== FormData.confirmPassword) {
            console.log("Please Check the Password");
            errors.confirmPassword = "Passwords do not match";
        }

        if (FormData.userName.trim().length === 0) {
            errors.userName = "UserName is Required"
        }
        if (FormData.role.trim().length === 0) {
            errors.role = "Role is Required"
        }
        if (FormData.email.trim().length === 0) {
            errors.email = "Email is Required"
        }
        if (FormData.password.trim().length === 0) {
            errors.password = "Password is Required"
        }
        if (FormData.confirmPassword.trim().length === 0) {
            errors.confirmPassword = "Confirm Password is Required"
        }
        if (FormData.phoneNumber.trim().length === 0) {
            errors.phoneNumber = "Phone Number is Required";
        }
        if (Object.keys(errors).length !== 0) {
            setError(errors);
            return
        }
        console.log("FormData", FormData)
        dispatch(RegisterUser({ FormData, redirect }));

        // setError({});

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
                >
                    Back
                </button>
                <div className="flex justify-center mb-4">
                    <img
                        // src={""}
                        alt="Logo"
                        className="w-20 h-20 object-cover rounded-full shadow-md border border-gray-200"
                    />
                </div>
                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Rental Parking
                </h1>
                <br />
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="text-left block text-gray-700 font-medium mb-1">
                            UserName :
                        </label>

                        <input
                            type="text"
                            value={FormData.userName}
                            name="userName"
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (FormData.userName.trim().length == 0) {
                                    setError({ ...Error, userName: "UserName is required" });
                                }
                            }}
                        />

                        {Error.userName && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.userName}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className=" text-left block text-gray-700 font-medium mb-1">
                            role :
                        </label>

                        <select
                            value={FormData.role}
                            name="role"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400"
                        >
                            <option value="">Select</option>
                            <option value="vendor">Vendor</option>
                            <option value="user">User</option>
                        </select>

                        {Error.role && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.role}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className=" text-left block text-gray-700 font-medium mb-1">
                            Email :
                        </label>

                        <input
                            type="email"
                            value={FormData.email}
                            name="email"
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (FormData.email.trim().length == 0) {
                                    setError({ ...Error, email: "Email is required" });
                                }
                            }}
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
                            value={FormData.phoneNumber}
                            name="phoneNumber"
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (FormData.phoneNumber.trim().length == 0) {
                                    setError({ ...Error, phoneNumber: "Phone Number is required" });
                                }
                            }}
                        />

                        {Error.phoneNumber && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.phoneNumber}
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="text-left block text-gray-700 font-medium mb-1">
                            PassWord :
                        </label>

                        <input
                            type="password"
                            value={FormData.password}
                            name="password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (FormData.password.trim().length == 0) {
                                    setError({ ...Error, password: "Password is required" });
                                }
                            }}
                        />

                        {Error.password && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.password}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="text-left block text-gray-700 font-medium mb-1">
                            Confirm Password :
                        </label>

                        <input
                            type="password"
                            value={FormData.confirmPassword}
                            name="confirmPassword"
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (FormData.confirmPassword.trim().length == 0) {
                                    setError({ ...Error, confirmPassword: "Confirm Password  is required" });
                                }
                            }}
                        />

                        {Error.confirmPassword && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.confirmPassword}
                            </span>
                        )}
                    </div>

                    <div>
                        <input
                            type="submit"
                            value="Register"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                        />
                    </div>

                </form>

            </div>
        </div>

    )
}
