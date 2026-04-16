import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../slices/BookingSlices";
import Pagination from "../../config/pagination.jsx";
import { Calendar, Car, Clock, CreditCard, Tag, User, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AllBookings() {
    const dispatch = useDispatch();
    const { myBooking, pagination } = useSelector((state) => state.booking);
    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};

    const handlePageChange = (page) => {
        dispatch(fetchBookings({ page, limit: 24 }));
    };
    useEffect(() => {
        dispatch(fetchBookings({ page: 1, limit: 24 }))
    }, [dispatch])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Booking Management</h1>
                        <p className="text-gray-500 mt-2 font-medium">Monitor all parking slot reservations</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></span>
                            <span className="font-bold text-gray-700">{myBooking?.length || 0} Total Bookings</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {(myBooking || [])
                        ?.slice()?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        ?.map((ele, i) => {
                            return (
                                <div
                                    key={i}
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 -mr-10 -mt-10 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-700"></div>

                                    <div className="relative flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg ring-4 ring-indigo-50">
                                                    <Car size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                        {ele.vehiclesNumber}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                                                        <Tag size={12} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">{ele.vehicletype}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${getStatusColor(ele.status)}`}>
                                                {getStatusIcon(ele.status)}
                                                {ele.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-1 bg-gray-100 rounded-md text-gray-500"><Clock size={12} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Starts</p>
                                                        <p className="text-sm font-bold text-gray-700">{new Date(ele.startTime).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-1 bg-gray-100 rounded-md text-gray-500"><Clock size={12} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ends</p>
                                                        <p className="text-sm font-bold text-gray-700">{new Date(ele.endTime).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-1 bg-emerald-50 rounded-md text-emerald-500"><CreditCard size={12} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Amount Paid</p>
                                                        <p className="text-xl font-black text-emerald-600">₹{ele.Amount.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 p-1 bg-blue-50 rounded-md text-blue-500"><Calendar size={12} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Plan</p>
                                                        <p className="text-sm font-bold text-gray-700">{ele.Based}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500 break-all">ID: {ele.userId}</span>
                                            </div>
                                            <p className="text-[10px] font-medium text-gray-300">Updated {new Date(ele.updatedAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    )
}