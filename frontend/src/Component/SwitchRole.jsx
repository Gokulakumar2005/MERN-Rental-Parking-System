import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchRole } from "../slices/authSlices";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "../slices/authSlices";
import { User, RefreshCw, ChevronDown } from "lucide-react";

export default function SwitchRole() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [AccountOpen, setAccountOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(UserAccount());
        }
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleChangeRole = async () => {
        const result = await dispatch(switchRole(user._id));

        if (result.meta.requestStatus === "fulfilled") {
            setAccountOpen(false);
            navigate("/dashboard");
        }
    };
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setAccountOpen(!AccountOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 font-bold text-sm ${AccountOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'}`}
            >
                <User size={18} />
                <span>Account</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${AccountOpen ? 'rotate-180' : ''}`} />
            </button>

            {AccountOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 mb-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Role</p>
                        <p className="text-sm font-semibold text-slate-800 capitalize mt-0.5">{user?.role || 'Guest'}</p>
                    </div>
                    <button
                        onClick={handleChangeRole}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-colors cursor-pointer"
                    >
                        <RefreshCw size={16} />
                        Switch Role
                    </button>
                </div>
            )}
        </div>
    )
}