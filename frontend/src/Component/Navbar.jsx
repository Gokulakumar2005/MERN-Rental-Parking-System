import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../slices/authSlices.jsx";
import { 
  Car, 
  LayoutDashboard, 
  Users, 
  MapPin, 
  BookOpen, 
  User, 
  LogOut, 
  CreditCard, 
  PlusCircle, 
  History,
  Settings,
  ChevronDown
} from "lucide-react";
import Notification from "./notification.jsx";
import SwitchRole from "./SwitchRole.jsx";
import { useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const { user, isLoggedIn } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
        setIsProfileOpen(false);
    };

    if (!isLoggedIn) return null;

    const navLinkClass = (path) => `
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
        ${location.pathname === path 
            ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
            : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"}
    `;

    return (
        <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex justify-between items-center">
           
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
                    <Car size={22} fill="currentColor" className="fill-indigo-300" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                    Park<span className="text-indigo-600">Flow</span>
                </span>
            </Link>

        
            <div className="hidden lg:flex items-center gap-2">
                {user.role === "admin" && (
                    <>
                        <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/Allusers" className={navLinkClass("/Allusers")}>
                            <Users size={18} /> Users
                        </Link>
                        <Link to="/AllParkingSlot" className={navLinkClass("/AllParkingSlot")}>
                            <MapPin size={18} /> Parking Slots
                        </Link>
                        <Link to="/AllBookings" className={navLinkClass("/AllBookings")}>
                            <BookOpen size={18} /> Bookings
                        </Link>
                    </>
                )}

                {user.role === "vendor" && (
                    <>
                        <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/addparkingslot" className={navLinkClass("/addparkingslot")}>
                            <PlusCircle size={18} /> Add Slot
                        </Link>
                        <Link to="/mybookings" className={navLinkClass("/mybookings")}>
                            <History size={18} /> Booked
                        </Link>
                        <Link to="/mySlot" className={navLinkClass("/mySlot")}>
                            <MapPin size={18} /> My Slots
                        </Link>
                    </>
                )}

                {user.role === "user" && (
                    <>
                        <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link to="/bookSlot" className={navLinkClass("/bookSlot")}>
                            <MapPin size={18} /> Book Slot
                        </Link>
                        <Link to="/mybookings" className={navLinkClass("/mybookings")}>
                            <History size={18} /> My Bookings
                        </Link>
                        <Link to="/mypayments" className={navLinkClass("/mypayments")}>
                            <CreditCard size={18} /> Payments
                        </Link>
                    </>
                )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                    <Notification />
                    {user.role !== "admin" && <SwitchRole />}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-200 uppercase">
                            {user.username?.substring(0, 2) || "U"}
                        </div>
                        <span className="hidden sm:block text-sm font-bold text-slate-700">{user.username}</span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.username}</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-md">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="p-2">
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={18} /> My Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
