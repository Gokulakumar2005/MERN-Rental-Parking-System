import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../../slices/BookingSlices";
import Pagination from "../../config/pagination.jsx";
import SearchBar from "../SearchBar";
import { Calendar, Car, Clock, CreditCard, Tag, User, CheckCircle, XCircle, AlertCircle, Activity, RefreshCcw, AlertTriangle } from "lucide-react";

import debounce from "lodash/debounce";
import { useLocation } from "react-router-dom";

export default function AllBookings() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { myBooking, pagination, error: reduxError } = useSelector((state) => state.booking);
    const [serverError, setServerError] = useState(null);
    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};


    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState("all");

    const debouncedFetch = useCallback(
        debounce((searchQuery, statusFilter) => {
            dispatch(fetchBookings({ page: 1, limit: 12, search: searchQuery, status: statusFilter }));
        }, 500),
        [dispatch]
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        debouncedFetch(value, status);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        dispatch(fetchBookings({ page: 1, limit: 12, search, status: value }));
    };

    const handlePageChange = (page) => {
        dispatch(fetchBookings({ page, limit: 12, search, status }));
    };

    useEffect(() => {
        dispatch(fetchBookings({ page: 1, limit: 12, search: initialSearch, status: "all" }));
    }, [dispatch, initialSearch]);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'expired': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-100';
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

    const filters = [
        { label: "All Bookings", value: "all" },
        { label: "Active", value: "Booked" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Expired", value: "Expired" }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 ">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Booking Management</h1>
                        <p className="text-gray-500 mt-2 font-medium">Monitor all parking slot reservations</p>
                    </div>
                    <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
                        <Activity className="text-emerald-500 animate-pulse" size={20} />
                        <span className="font-bold text-gray-700">{totalItems} Total Bookings</span>
                    </div>
                </div>

                {serverError && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Booking Database Access</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : serverError?.message || "Failed to retrieve booking records."}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setServerError(null);
                                dispatch(fetchBookings({ page: 1, limit: 12, search, status }));
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span className="hidden sm:inline">Retry</span>
                        </button>
                    </div>
                )}


                <div className="max-w-xl" >
                    <SearchBar 
                        placeholder="Search by vehicle number or area..."
                        value={search}
                        onChange={handleSearchChange}
                        filters={filters}
                        activeFilter={status}
                        onFilterChange={handleStatusChange}
                    />
                </div>

                {myBooking.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myBooking.map((ele, i) => (
                            <div
                                key={ele._id || i}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col"
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
                                                    <p className="text-sm font-bold text-gray-700">{new Date(ele.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-1 bg-gray-100 rounded-md text-gray-500"><Clock size={12} /></div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ends</p>
                                                    <p className="text-sm font-bold text-gray-700">{new Date(ele.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
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
                                                    <p className="text-sm font-bold text-gray-700 capitalize">{ele.Based}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                                        <div className="flex items-center gap-2 max-w-[70%]">
                                            <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                <User size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-500 truncate" title={ele.userId}>ID: {ele.userId}</span>
                                        </div>
                                        <p className="text-[10px] font-medium text-gray-300">Updated {new Date(ele.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
                        <Calendar className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-gray-900">No bookings found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">We couldn't find any reservations matching your current search or filter criteria.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 w-fit mx-auto">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </div>
    );
}