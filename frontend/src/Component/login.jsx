

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LoginUser } from "../slices/authSlices.jsx";
import { useState } from "react"
import { Link } from "react-router-dom";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Error, setError] = useState({})
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const redirect = () => {
        navigate("/dashboard");
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.email.trim().length === 0) {
            errors.email = "Email is Required"
        }
        if (formData.password.trim().length === 0) {
            errors.password = "Password is Required"
        }

        if (Object.keys(errors).length !== 0) {
            setError(errors)
            return;
        }

        console.log("formData", formData);
        dispatch(LoginUser({ formData, redirect }));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-green-50 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

                <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
                    Login Page
                </h1>

                {/* <p className="text-gray-500 text-center mb-6">
                    Login to access your clinic account
                </p> */}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Email :
                        </label>

                        <input
                            type="text"
                            placeholder="enter the Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (formData.email.trim().length === 0) {
                                    setError({ ...Error, email: "Email is Required" })
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
                        <label className="block text-gray-700 font-medium mb-1">
                            Password :
                        </label>

                        <input
                            type="password"
                            placeholder="enter the Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onBlur={() => {
                                if (formData.password.trim().length === 0) {
                                    setError({ ...Error, password: "Password is Required" })
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
                        <input
                            type="submit"
                            value="Login"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                        />
                    </div>

                </form>
               

                <Link to="/register" className="text-blue-500 hover:underline block text-center mt-4">
                    Don't have an account? Register here
                </Link>
                 <Link to="/forgotpassword" className="text-blue-500 hover:underline block text-center mt-4">
                    Forgot Password ?
                </Link>
            </div>
        </div>
    )
}
