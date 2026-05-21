import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, CancelBooking } from "../slices/BookingSlices";
import { FetchSlots } from "../slices/parkingSlot";
import MyMap from "../config/mapComponent";
import { useNavigate } from "react-router-dom";
import Pagination from "../config/pagination";
import { CalendarDays, Car, Clock, MessageCircle, XCircle, AlertTriangle, CalendarCheck, IndianRupee, RefreshCcw, MapPin } from "lucide-react";
import { toast } from "react-toastify";

export default function Mybookings() {
    const { myBooking, error, pagination } = useSelector((state) => state.booking);
    const { user } = useSelector((state) => state.auth);
    const { Slot: slots } = useSelector((state) => state.slot);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    const { currentPage = 1, totalPages = 1 } = pagination || {};

    const handlePageChange = (page) => {
        dispatch(fetchBookings({ page, limit: 24 }));
    };

    useEffect(() => {
        dispatch(fetchBookings({ page: 1, limit: 24 }));
        dispatch(FetchSlots({ page: 1, limit: 100 }));
    }, [dispatch]);

    const CommonId_Bookings = Array.isArray(myBooking) && user?._id
        ? myBooking.filter((ele) => ele.userId === user._id || ele.vendorId === user._id)
        : [];
    console.log({ "common_id_bookings": CommonId_Bookings });

    useEffect(() => {
        if (error) {
            setServerError(error);
        }
    }, [error]);


    const handleCancle = (ele) => {
        toast(({ closeToast }) => (
            <div className="p-2">
                <p className="mb-2 text-sm">
                    Are you sure you want to cancel the booking?
                </p>

                <div className="flex gap-2">
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => {
                        dispatch(CancelBooking(ele._id));
                        closeToast();
                    }}> OK
                    </button>

                    <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={closeToast} >
                        Cancel
                    </button>
                </div>
            </div>
        ), { autoClose: false });
    };

    const statusConfig = {
        Booked: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CalendarCheck size={12} /> },
        completed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: <CalendarCheck size={12} /> },
        Cancelled: { color: "bg-rose-100 text-rose-700 border-rose-200", icon: <XCircle size={12} /> },
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
                            <CalendarDays size={24} />
                        </div>
                        My Bookings
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 ml-14">View and manage all your parking slot reservations.</p>
                </div>

                {serverError && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Booking Service Connection</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : serverError?.message || "There was an error loading your bookings."}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setServerError(null);
                                dispatch(fetchBookings({ page: 1, limit: 24 }));
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span className="hidden sm:inline">Retry</span>
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {CommonId_Bookings.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-16 text-center flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-slate-300">
                                <CalendarDays size={40} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-800">No bookings yet</h3>
                            <p className="text-slate-500 font-medium mt-2">Book a parking slot to see your reservations here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {[...CommonId_Bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, index) => {
                                const cfg = statusConfig[ele.status] || { color: "bg-slate-100 text-slate-600 border-slate-200", icon: <Clock size={12} /> };
                                
                                // Retrieve slot details from Redux store using slotId
                                const slotIdStr = ele.slotId?._id || ele.slotId;
                                const slotFromStore = Array.isArray(slots) ? slots.find(s => s._id === slotIdStr) : null;
                                const slotDetails = slotFromStore || ele.slotId || {};
                                
                                const destination = slotDetails?.location?.geo ? {
                                    lat: Number(slotDetails.location.geo.lat),
                                    lng: Number(slotDetails.location.geo.lng)
                                } : null;

                                return (
                                    <div key={index} className="bg-white shadow-lg shadow-slate-200/40 rounded-3xl p-6 border border-slate-100 hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100">
                                                    <Car size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-slate-800 text-lg">{ele.vehicletype} — {ele.vehiclesNumber}</h3>
                                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Booking #{index + 1}</p>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-bold uppercase tracking-wider border ${cfg.color}`}>
                                                {cfg.icon}
                                                {ele.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                                                <p className="font-extrabold text-emerald-600 flex items-center gap-0.5"><IndianRupee size={14} />{ele.Amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle</p>
                                                <p className="font-bold text-slate-700 text-sm">{ele.vehicletype}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start</p>
                                                <p className="font-bold text-slate-700 text-sm">{new Date(ele.startTime).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End</p>
                                                <p className="font-bold text-slate-700 text-sm">{new Date(ele.endTime).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {ele.status === "Booked" && new Date(ele.endTime) > new Date() && (ele.slotId || slotFromStore) && (
                                            <div className="mt-4 mb-5 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                                    <MapPin size={16} className="text-indigo-600" />
                                                     Location & Routing Details
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Facility Name</p>
                                                            <p className="font-bold text-slate-700 text-sm">{slotDetails.name || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Full Address</p>
                                                            <p className="font-bold text-slate-700 text-sm">{slotDetails.address || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Area</p>
                                                            <p className="font-bold text-slate-700 text-sm">{slotDetails.Area || ele.Area || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="h-48 md:h-full min-h-[12rem] rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                                        {destination ? (
                                                            <MyMap location={destination} height="h-full min-h-[12rem]" />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full bg-slate-100 text-xs text-slate-500 font-bold p-4 text-center">
                                                                No coordinates available for routing
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {ele.status === "Booked" && (
                                            <p className="text-xs text-amber-600 font-bold flex items-center gap-2 mb-4 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">
                                                <AlertTriangle size={14} /> Cancellation available up to 8 hours before booking start.
                                            </p>
                                        )}

                                        {ele.status === "Booked" && (
                                            <div className="flex items-center gap-3 justify-end">
                                                <button
                                                    onClick={() => navigate("/chatPage", { state: ele })}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm cursor-pointer"
                                                >
                                                    <MessageCircle size={16} /> Chat
                                                </button>
                                                <button
                                                    onClick={() => handleCancle(ele)}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 font-bold rounded-xl hover:bg-rose-100 transition text-sm cursor-pointer"
                                                >
                                                    <XCircle size={16} /> Cancel Booking
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="mt-6">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}