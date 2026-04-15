import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "../config/axiosInstance";
import { useSelector } from "react-redux";
import { Bell, Check, Trash2, X } from "lucide-react";

export default function NotificationDropdown() {
    const { user, isLoggedIn } = useSelector((state) => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const socketRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications", { headers: { Authorization: localStorage.getItem("token") } });
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    // useEffect(() => {
    //     if (isLoggedIn && user) {
    //         fetchNotifications();

    //         socketRef.current = io(axios.defaults.baseURL);

    //         // Join personal room for private notifications
    //         socketRef.current.emit("joinUserRoom", user._id);

    //         // Listen for user-specific notifications
    //         socketRef.current.on("notification", (notification) => {
    //             setNotifications((prev) => [notification, ...prev]);
    //             // Optional: Show a toast or play a sound
    //         });


    //         return () => {
    //             if (socketRef.current) {
    //                 socketRef.current.disconnect();
    //             }
    //         };
    //     }
    // }, [isLoggedIn, user]);
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
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            >
               <span> <Bell size={24} /></span>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
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
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all duration-300">
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="text-gray-400" size={20} />
                                    </div>
                                    <p className="text-gray-500 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id}
                                        onClick={() => !n.isRead && markAsRead(n._id)}
                                        className={`p-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
                                            !n.isRead ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? "bg-blue-500" : "bg-transparent"}`}></div>
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.isRead ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                                    {new Date(n.createdAt).toLocaleString([], {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <Check 
                                                    size={14} 
                                                    className="text-blue-500 opacity-0 group-hover:opacity-100 transition" 
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-50 text-center bg-gray-50/30">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-gray-500 hover:text-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}