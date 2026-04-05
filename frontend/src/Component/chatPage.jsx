
import { io } from "socket.io-client";
import axios from "../config/axiosInstance";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../slices/BookingSlices";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatPage() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const Data = location.state;

    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

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
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600 mb-4">
                    Invalid chat data.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Go Back
                </button>
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
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    ← Back
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 p-4 text-white">
                        <h1 className="text-xl font-bold">
                            Chat with
                            {String(user?._id) === bookingUserId
                                ? "Vendor"
                                : "User"}
                        </h1>
                        <p className="text-sm opacity-80">
                            Vehicle: {Data.vehiclesNumber} ({Data.vehicletype})
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 flex flex-col h-[60vh]">
                        <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 pr-2">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 my-auto">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMe =
                                        String(msg.senderId) ===
                                        String(user?._id);

                                    return (
                                        <div
                                            key={i}
                                            className={`flex ${
                                                isMe
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm ${
                                                    isMe
                                                        ? "bg-blue-500 text-white rounded-tr-none"
                                                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                                }`}
                                            >
                                                <p className="text-xs font-semibold mb-1 opacity-75">
                                                    {isMe
                                                        ? "You"
                                                        : String(user?._id) ===
                                                          bookingUserId
                                                        ? "Vendor"
                                                        : "User"}
                                                </p>
                                                <p className="break-words">
                                                    {msg.message}
                                                </p>
                                                <p className="text-[10px] text-right mt-1 opacity-60">
                                                    {new Date(
                                                        msg.createdAt ||
                                                            Date.now()
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                            <input
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                                className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}