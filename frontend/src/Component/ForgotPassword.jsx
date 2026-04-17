import { useState } from "react";
import axios from "../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail, ShieldCheck, ChevronLeft, Lock, AlertTriangle, RefreshCcw } from "lucide-react";


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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8">
            <div className="w-full max-w-lg bg-white shadow-2xl shadow-indigo-100/50 rounded-[2rem] p-8 sm:p-12 relative border border-slate-100">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center group cursor-pointer"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="sr-only">Back</span>
                </button>

                <div className="text-center mb-10 pt-4">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                        {passwordPage ? <Lock size={32} /> : <KeyRound size={32} />}
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {passwordPage ? "Update Password" : "Forgot Password"}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {passwordPage ? "Enter your new password below." : "Enter your details to receive an OTP."}
                    </p>
                </div>

                {ServerError.length > 0 && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-8 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Verification Error</h4>
                            <p className="text-sm text-rose-600 font-bold">{String(ServerError)}</p>
                        </div>
                        <button onClick={() => setSeverError("")} className="text-rose-400 hover:text-rose-600 transition-colors">
                            <ChevronLeft size={16} className="rotate-90" />
                        </button>
                    </div>
                )}


                {!passwordPage ? (
                    <form className="space-y-6" onSubmit={handleVerify}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Mobile Number / Email
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => setDetail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                        placeholder="Enter your Details"
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGenerateOtp}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
                                >
                                    Send OTP
                                </button>
                            </div>
                            {Error.detail && <p className="text-red-500 text-xs font-bold pl-1">{Error.detail}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Verify OTP
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={enteropt}
                                    onChange={(e) => setenteropt(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                    placeholder="Enter OTP"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}