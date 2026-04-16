import { io } from "socket.io-client";
import axios from "../config/axiosInstance";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../slices/BookingSlices";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";

export default function ChatPage() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const Data = location.state;

    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    useEffect(() => {
        socketRef.current = io(axios.defaults.baseURL);

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    if (!Data || !Data.userId || !Data.vendorId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
                    <MessageSquare size={48} className="text-slate-300 mb-4" />
                    <p className="text-xl font-bold text-slate-800 mb-6">
                        Invalid chat session
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const bookingUserId = String(Data.userId);
    const bookingVendorId = String(Data.vendorId);

    const roomId = [bookingUserId, bookingVendorId].sort().join("_");

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.emit("joinRoom", roomId);

        axios
            .get(`/api/chat/${roomId}`)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch messages", err);
            });

        const handleReceiveMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        socketRef.current.on("receiveMessage", handleReceiveMessage);

        return () => {
            socketRef.current.off("receiveMessage", handleReceiveMessage);
        };
    }, [roomId]);

    const sendMessage = () => {
        if (!message.trim() || !user) return;

        const receiverId =
            String(user._id) === bookingUserId
                ? bookingVendorId
                : bookingUserId;

        const messageData = {
            roomId,
            senderId: user._id,
            receiverId,
            message: message.trim(),
        };

        socketRef.current.emit("sendMessage", messageData);
        setMessage("");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
                <button
                    onClick={() => navigate(-1)}
                    className="self-start mb-6 text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl hover:bg-white transition shadow-sm border border-transparent hover:border-slate-200 flex items-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                    Back to Bookings
                </button>

                <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <MessageSquare size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight">
                                Chat with {String(user?._id) === bookingUserId ? "Vendor" : "User"}
                            </h1>
                            <p className="text-sm font-medium text-indigo-100 mt-1">
                                Regarding: {Data.vehiclesNumber} ({Data.vehicletype})
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-slate-50/50 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto mb-6 flex flex-col gap-4 pr-2 no-scrollbar">
                            {messages.length === 0 ? (
                                <div className="text-center flex flex-col items-center justify-center h-full m-auto">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
                                        <MessageSquare size={28} />
                                    </div>
                                    <p className="text-slate-800 font-bold text-lg">Send a message to start!</p>
                                    <p className="text-slate-500 text-sm mt-1">Your conversation will appear here.</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe = String(msg.senderId) === String(user?._id);

                                    return (
                                        <div
                                            key={i}
                                            className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`px-5 py-3.5 max-w-[80%] shadow-sm ${
                                                    isMe
                                                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                                        : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm shadow-slate-200/40"
                                                }`}
                                            >
                                                <p className={`text-xs font-bold mb-1 opacity-75 ${isMe ? "text-indigo-100" : "text-slate-400"}`}>
                                                    {isMe
                                                        ? "You"
                                                        : String(user?._id) === bookingUserId
                                                        ? "Vendor"
                                                        : "User"}
                                                </p>
                                                <p className="break-words font-medium leading-snug">
                                                    {msg.message}
                                                </p>
                                                <p className={`text-[10px] text-right mt-2 font-bold ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-slate-100 bg-white p-3 rounded-2xl shadow-sm">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400 font-medium"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="bg-indigo-600 text-white px-5 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} className={message.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}