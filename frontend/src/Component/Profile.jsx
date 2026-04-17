import { useSelector, useDispatch } from "react-redux";
import { useState, useRef,useEffect } from "react";
import { UpdateProfile } from "../slices/authSlices";
import axios from "../config/axiosInstance.jsx";
import { User, Mail, Phone, Edit3, Camera, KeyRound, Shield, CheckCircle2, AlertCircle, X, AlertTriangle, RefreshCcw } from "lucide-react";


export default function Profile() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const { user, Error: reduxError } = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


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
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 pt-12 sm:p-8">
            <div className="max-w-2xl mx-auto bg-white shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden border border-slate-100">
                {/* Header Gradient Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 relative">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm opacity-50"></div>
                </div>

                {serverError && (
                    <div className="mx-8 mt-6 bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-0 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Profile Update Alert</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "There was an error updating your profile data."}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setServerError(null);
                            }}
                            className="p-2.5 bg-rose-100 text-rose-600 font-bold rounded-xl hover:bg-rose-200 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}


                <div className="px-8 sm:px-12 pb-12 relative -mt-16">
                    <div className="flex justify-center relative mb-8">
                        <div className="relative group">
                            <div className="hidden">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <img
                                src={(showUpdateForm ? preview : null) || user?.profilePic || "https://ui-avatars.com/api/?name=" + (user?.userName || "User") + "&background=c7d2fe&color=3730a3&size=150"} 
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white bg-white"
                            />
                            {showUpdateForm && (
                                <button
                                    type="button"
                                    onClick={handleEditClick}
                                    className="absolute bottom-0 right-0 p-2.5 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition cursor-pointer border-2 border-white"
                                >
                                    <Camera size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {!showUpdateForm && !showPasswordForm ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user?.userName}</h2>
                                <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                                    {user?.role || "Member"}
                                </span>
                            </div>

                            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 border border-slate-100">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-width text-slate-400 mb-0.5">Email Address</p>
                                        <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 border border-slate-100">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-width text-slate-400 mb-0.5">Phone Number</p>
                                        <p className="text-sm font-semibold text-slate-800">{user?.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <button 
                                    onClick={() => setShowUpdateForm(true)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition shadow-sm cursor-pointer"
                                >
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                                <button 
                                    onClick={() => setShowPasswordForm(true)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold py-3.5 px-4 rounded-xl border border-rose-100 hover:bg-rose-100 transition cursor-pointer"
                                >
                                    <Shield size={18} />
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    ) : showUpdateForm ? (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">Update Profile</h3>
                                <p className="text-slate-500 text-sm mt-1">Make changes to your personal information.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={updateForm.userName}
                                        name="userName"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    />
                                </div>
                                {Error.userName && <span className="text-red-500 text-xs font-bold pl-1">{Error.userName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={updateForm.email}
                                        name="email"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
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
                                        value={updateForm.phoneNumber}
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                    />
                                </div>
                                {Error.phoneNumber && <span className="text-red-500 text-xs font-bold pl-1">{Error.phoneNumber}</span>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUpdateForm(false);
                                        setError({});
                                        setPreview(null);
                                    }}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-sm hover:shadow-md flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle2 size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">Security</h3>
                                <p className="text-slate-500 text-sm mt-1">Update your password to keep your account secure.</p>
                            </div>
                            
                            {passwordError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Shield size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Shield size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswordError("");
                                        setPasswordSuccess("");
                                        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                                    }}
                                    className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-sm hover:shadow-md flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle2 size={18} />
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
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