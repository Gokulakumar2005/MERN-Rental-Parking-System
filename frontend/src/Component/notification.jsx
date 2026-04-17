import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "../config/axiosInstance";
import { useSelector } from "react-redux";
import { Bell, Check, X, BellRing, AlertTriangle, RefreshCcw } from "lucide-react";



export default function NotificationDropdown() {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [serverError, setServerError] = useState(null);
    const socketRef = useRef(null);


    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications", { headers: { Authorization: localStorage.getItem("token") } });
            setNotifications(res.data);
            setServerError(null);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setServerError("Failed to sync alerts.");
        }
    };


    useEffect(() => {
        if (isLoggedIn && user) {
            fetchNotifications();

            socketRef.current = io(axios.defaults.baseURL);

            socketRef.current.emit("joinUserRoom", user._id);

            socketRef.current.on("connect", () => {
                console.log("Socket connected");
            });

            socketRef.current.on("notification", (notification) => {
                setNotifications((prev) => [notification, ...prev]);

                if (notification.type === "peakHours") {
                    alert(notification.message);
                }
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        }
    }, [isLoggedIn, user]);

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/read`,{}, { headers: { Authorization: localStorage.getItem("token") } });
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put("/api/notifications/read-all",{}, { headers: { Authorization: localStorage.getItem("token") } });
            setNotifications((prev) => prev.map((ele) => ({ ...ele, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const unreadCount = notifications.filter((ele) => !ele.isRead).length;

    if (!isLoggedIn) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'}`}
            >
                {unreadCount > 0 && !isOpen ? (
                    <BellRing size={20} className="animate-pulse text-indigo-500" />
                ) : (
                    <Bell size={20} />
                )}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden transform origin-top-right transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Bell size={16} />
                                </div>
                                <h3 className="font-extrabold text-slate-800 tracking-tight">Notifications</h3>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-[11px] uppercase tracking-wider text-indigo-600 hover:text-indigo-700 font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {serverError && (
                            <div className="bg-rose-50 border-b border-rose-100 p-3 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="text-rose-500" size={14} />
                                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">{serverError}</p>
                                </div>
                                <button onClick={fetchNotifications} className="p-1 bg-white border border-rose-100 rounded-md text-rose-500 hover:bg-rose-50">
                                    <RefreshCcw size={10} />
                                </button>
                            </div>
                        )}

                        <div className="max-h-[400px] overflow-y-auto no-scrollbar bg-slate-50/50">

                            {notifications.length === 0 ? (
                                <div className="px-8 py-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                        <Bell size={28} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-lg">You're all caught up!</p>
                                    <p className="text-slate-500 text-sm mt-1">No new notifications right now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => !n.isRead && markAsRead(n._id)}
                                            className={`group p-4 transition-all duration-200 ${
                                                !n.isRead ? "bg-indigo-50/40 hover:bg-indigo-50/80 cursor-pointer" : "bg-white hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    {n.isRead ? (
                                                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                                    ) : (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 animate-pulse"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm leading-snug ${!n.isRead ? "text-slate-800 font-bold" : "text-slate-600 font-medium"}`}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                                        {new Date(n.createdAt).toLocaleString([], {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                {!n.isRead && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="p-1 rounded-full bg-white shadow-sm border border-slate-100 text-indigo-500">
                                                            <Check size={12} strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-slate-100 bg-white">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                            >
                                Close Menu
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}