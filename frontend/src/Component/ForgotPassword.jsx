import { useState } from "react";
import axios from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [detail, setDetail] = useState("");
    const [Error, setError] = useState({});
    const [ServerError, setSeverError] = useState("");
    const [enteropt, setenteropt] = useState("");
    const [backendOPT, setBackendOPT] = useState({});
    const [passwordPage, setPasswordPage] = useState(false);
    
    // New states for resetting password
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleGenerateOtp = async (e) => {
        e.preventDefault();
        setSeverError("");
        const error = {};
        if (detail.trim().length === 0) {
            error.detail = "Phone Number / Email are Required * ";
        }
        if (Object.keys(error).length !== 0) {
            setError(error);
            return;
        }
        try {
            const response = await axios.post("/forgot/password", { detail });
            setBackendOPT(response.data);
            alert("OTP sent successfully!");
        } catch (error) {
            const err =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Something went wrong";
            setSeverError(typeof err === "string" ? err : JSON.stringify(err));
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        setSeverError("");
        if (enteropt.length === 0) {
            setSeverError("Enter OTP to verify.");
            return;
        }
        if (backendOPT?.BackendOPT == enteropt) {
            alert("OTP verified successfully");
            setPasswordPage(true);
        } else {
            setSeverError("Invalid OTP. Please try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setSeverError("");
        if (newPassword.length < 6) {
            setSeverError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setSeverError("Passwords do not match.");
            return;
        }
        try {
            const response = await axios.post("/reset/password", {
                detail,
                newPassword,
            });
            alert(response.data.message || "Password updated successfully");
            navigate("/login");
        } catch (error) {
            const err =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.response?.data ||
                "Failed to update password";
            setSeverError(typeof err === "string" ? err : JSON.stringify(err));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {passwordPage ? "Update Password" : "Forgot Password"}
                </h2>

                {ServerError.length > 0 && (
                    <p className="text-red-600 text-center mb-3 font-medium">
                        {String(ServerError)}
                    </p>
                )}

                {!passwordPage ? (
                    <form className="space-y-5" onSubmit={handleVerify}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Enter the Mobile Number / Email :
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-black"
                                    placeholder="Enter your Details"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateOtp}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 rounded-lg transition shadow-md"
                                >
                                    Send OTP
                                </button>
                            </div>
                            {Error.detail && <p className="text-red-500 text-sm mt-1">{Error.detail}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Verify OTP
                            </label>
                            <input
                                type="text"
                                value={enteropt}
                                onChange={(e) => setenteropt(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-black"
                                placeholder="Enter OTP"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </form>
                ) : (
                    <form className="space-y-5" onSubmit={handleResetPassword}>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-black"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-black"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"
                        >
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}