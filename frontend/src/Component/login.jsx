import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, GoogleLoginUser } from "../slices/authSlices.jsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { MapPin, ShieldCheck, MessageCircle, Briefcase, Mail, Lock, ChevronLeft, Car } from "lucide-react";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { Error: reduxError ,loading} = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        } else {
            setServerError(null);
        }
    }, [reduxError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (serverError) {
            setServerError(null);
        }
    };

    const redirect = () => navigate("/dashboard");
    const loginRedirect = () => navigate("/login");

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (formData.email.trim().length === 0) {
            errors.email = "Email is Required";
        }
        if (formData.password.trim().length === 0) {
            errors.password = "Password is Required";
        }

        if (Object.keys(errors).length !== 0) {
            setError(errors);
            return;
        }

        dispatch(LoginUser({ formData, redirect, loginRedirect }));
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
            <div className="w-full max-w-5xl bg-white shadow-2xl shadow-indigo-100/50 rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-slate-100">

                {/* Left Side: Information Panel */}
                <div className="hidden md:flex flex-col justify-between w-5/12 bg-indigo-600 text-white p-12 relative overflow-hidden order-2 md:order-1">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>

                    <div className="relative z-10 space-y-8">
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                                <Car size={32} className="text-indigo-100" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Seamless Parking</h2>
                            <p className="text-indigo-100 text-lg leading-relaxed">
                                Revolutionizing urban movement. Secure, affordable, and instant reservations.
                            </p>
                        </div>

                        <div className="space-y-6 pt-6 grid grid-cols-1 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <MapPin size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Geo-Discovery</h4>
                                    <p className="text-indigo-200 text-sm mt-1">Discover spaces exactly where you need them.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <ShieldCheck size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Secure Transactions</h4>
                                    <p className="text-indigo-200 text-sm mt-1">Integrated payments ensure money is safe.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <MessageCircle size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Instant Connect</h4>
                                    <p className="text-indigo-200 text-sm mt-1">Chat directly with space owners in real-time.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

             
                <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 relative order-1 md:order-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center group cursor-pointer"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="sr-only">Back</span>
                    </button>

                    <div className="max-w-sm mx-auto">
                        <div className="text-center md:text-left mb-10 mt-4 md:mt-0">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                            <p className="text-slate-500 mt-2 font-medium">Login to manage your bookings and spaces.</p>
                        </div>

                        {serverError && (
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="p-2 bg-white text-rose-500 rounded-lg shadow-sm border border-rose-100 shrink-0">
                                    <Lock size={16} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Authentication Failed</h4>
                                    <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "Please check your credentials and try again."}</p>
                                </div>
                                <button onClick={() => setServerError(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
                                    <ChevronLeft size={16} className="rotate-90" />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">


                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                        placeholder="john@example.com"
                                        onBlur={() => {
                                            if (formData.email.trim().length === 0) {
                                                setError((prev) => ({ ...prev, email: "Email is Required" }));
                                            }
                                        }}
                                    />
                                </div>
                                {error.email && <span className="text-red-500 text-xs font-bold pl-1">{error.email}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <Link to="/forgotpassword" data-id="forgot-password-link" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                        placeholder="••••••••"
                                        onBlur={() => {
                                            if (formData.password.trim().length === 0) {
                                                setError((prev) => ({ ...prev, password: "Password is Required" }));
                                            }
                                        }}
                                    />
                                </div>
                                {error.password && <span className="text-red-500 text-xs font-bold pl-1">{error.password}</span>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    {loading ? "Processing..." : "Access Account"}  
                                </button>
                            </div>

                            <div className="relative my-6 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        dispatch(GoogleLoginUser({ credential: credentialResponse.credential, redirect }));
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                    theme="outline"
                                    width="100%"
                                    size="large"
                                />
                            </div>

                            <p className="text-center text-sm font-medium text-slate-500 mt-8">
                                Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold ml-1">Create Account</Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
