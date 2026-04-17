import { useState } from "react";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../slices/authSlices.jsx";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Tag, ShieldCheck, Car, LayoutDashboard, ChevronLeft, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";


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

    const { Error: reduxError } = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);
    const [Error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(null);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


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
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-8">
            <div className="w-full max-w-5xl bg-white shadow-2xl shadow-indigo-100/50 rounded-[2rem] overflow-hidden flex flex-col md:flex-row border border-slate-100">
                
                {/* Left Side: Information Panel */}
                <div className="hidden md:flex flex-col justify-between w-5/12 bg-indigo-600 text-white p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>
                    
                    <div className="relative z-10 space-y-8">
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                                <Car size={32} className="text-indigo-100" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Join Rental Parking</h2>
                            <p className="text-indigo-100 text-lg leading-relaxed">
                                Experience hassle-free parking management. Whether you're a driver or a vendor, we have you covered.
                            </p>
                        </div>

                        <div className="space-y-6 pt-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <ShieldCheck size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Secure & Reliable</h4>
                                    <p className="text-indigo-200 text-sm mt-1">100% secure payment protection and verified slots.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <Car size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Instant Booking</h4>
                                    <p className="text-indigo-200 text-sm mt-1">Find and reserve your spot in seconds, anywhere.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-indigo-500/30 rounded-xl mt-1">
                                    <LayoutDashboard size={20} className="text-indigo-100" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Vendor Dashboard</h4>
                                    <p className="text-indigo-200 text-sm mt-1">Manage slots, track earnings, and run your business.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Panel */}
                <div className="w-full md:w-7/12 p-8 sm:p-12 lg:p-16 relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center group cursor-pointer"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="sr-only">Back</span>
                    </button>

                    <div className="max-w-md mx-auto">
                        <div className="text-center md:text-left mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
                            <p className="text-slate-500 mt-2 font-medium">Please fill in your details to get started.</p>
                        </div>

                        {serverError && (
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Registration Issue</h4>
                                    <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "There was an error creating your account."}</p>
                                </div>
                                <button onClick={() => setServerError(null)} className="text-rose-400 hover:text-rose-600 transition-colors">
                                    <Lock size={14} className="rotate-45" />
                                </button>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-5">

                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={FormData.userName}
                                            name="userName"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                            placeholder="John Doe"
                                            onBlur={() => {
                                                if (FormData.userName.trim().length === 0) {
                                                    setError({ ...Error, userName: "UserName is required" });
                                                }
                                            }}
                                        />
                                    </div>
                                    {Error.userName && <span className="text-red-500 text-xs font-bold pl-1">{Error.userName}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Role</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Tag size={18} />
                                        </div>
                                        <select
                                            value={FormData.role}
                                            name="role"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium appearance-none"
                                        >
                                            <option value="" disabled hidden>Select Role</option>
                                            <option value="vendor">Vendor</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                    {Error.role && <span className="text-red-500 text-xs font-bold pl-1">{Error.role}</span>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={FormData.email}
                                        name="email"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                        placeholder="john@example.com"
                                        onBlur={() => {
                                            if (FormData.email.trim().length === 0) {
                                                setError({ ...Error, email: "Email is required" });
                                            }
                                        }}
                                    />
                                </div>
                                {Error.email && <span className="text-red-500 text-xs font-bold pl-1">{Error.email}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={FormData.phoneNumber}
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                        placeholder="+1 (555) 000-0000"
                                        onBlur={() => {
                                            if (FormData.phoneNumber.trim().length === 0) {
                                                setError({ ...Error, phoneNumber: "Phone Number is required" });
                                            }
                                        }}
                                    />
                                </div>
                                {Error.phoneNumber && <span className="text-red-500 text-xs font-bold pl-1">{Error.phoneNumber}</span>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={FormData.password}
                                            name="password"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                            placeholder="••••••••"
                                            onBlur={() => {
                                                if (FormData.password.trim().length === 0) {
                                                    setError({ ...Error, password: "Password is required" });
                                                }
                                            }}
                                        />
                                    </div>
                                    {Error.password && <span className="text-red-500 text-xs font-bold pl-1">{Error.password}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={FormData.confirmPassword}
                                            name="confirmPassword"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium placeholder-slate-400"
                                            placeholder="••••••••"
                                            onBlur={() => {
                                                if (FormData.confirmPassword.trim().length === 0) {
                                                    setError({ ...Error, confirmPassword: "Confirm Password is required" });
                                                }
                                            }}
                                        />
                                    </div>
                                    {Error.confirmPassword && <span className="text-red-500 text-xs font-bold pl-1">{Error.confirmPassword}</span>}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 cursor-pointer"
                                >
                                    Create Account
                                </button>
                            </div>
                            
                            <p className="text-center text-sm font-medium text-slate-500 mt-6">
                                Already have an account? <button onClick={redirect} type="button" className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold cursor-pointer">Sign in</button>
                            </p>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
