import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllUser } from "../../slices/authSlices";
import { fetchBookings } from "../../slices/BookingSlices";
import Pagination from "../../config/pagination";
import SearchBar from "../SearchBar";
import { User, Phone, Mail, Wallet, Users, ArrowRight, Activity, CalendarDays, AlertTriangle, RefreshCcw, FileText } from "lucide-react";
import { generateReportPDF } from "../../utils/pdfGenerator";

import debounce from "lodash/debounce";
import { useLocation } from "react-router-dom";

export default function AllUser() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { Alluser, pagination, Error: reduxError } = useSelector((state) => state.auth);
    const { myBooking } = useSelector((state) => state.booking);
    const [serverError, setServerError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};


    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [role, setRole] = useState("all");


    const debouncedFetch = useCallback(
        debounce((searchQuery, roleFilter) => {
            dispatch(FetchAllUser({ page: 1, limit: 12, search: searchQuery, role: roleFilter }));
        }, 500),
        [dispatch]
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        debouncedFetch(value, role);
    };

    const handleRoleChange = (value) => {
        setRole(value);
        dispatch(FetchAllUser({ page: 1, limit: 12, search, role: value }));
    };

    const handlePageChange = (page) => {
        dispatch(FetchAllUser({ page, limit: 12, search, role }));
    };

    useEffect(() => {
        dispatch(FetchAllUser({ page: 1, limit: 12, search: initialSearch, role: "all" }));
        dispatch(fetchBookings({ page: 1, limit: 100 }));
    }, [dispatch, initialSearch]);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


    const filters = [
        { label: "All", value: "all" },
        { label: "Users", value: "user" },
        { label: "Vendors", value: "vendor" },
        { label: "Admins", value: "admin" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Users strokeWidth={2.5} size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">System Users</h1>
                            <p className="text-slate-500 mt-1 font-medium text-sm sm:text-base">Manage and monitor all platform accounts</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
                        <Activity className="text-emerald-500 animate-pulse" size={20} />
                        <span className="font-bold text-slate-700">{totalItems} Members</span>
                    </div>
                </div>

                {serverError && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">User Directory Connection</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "Failed to load system users."}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setServerError(null);
                                dispatch(FetchAllUser({ page: 1, limit: 12, search, role }));
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span className="hidden sm:inline">Retry Search</span>
                        </button>
                    </div>
                )}


                <div className="max-w-xl">
                    <SearchBar
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={handleSearchChange}
                        filters={filters}
                        activeFilter={role}
                        onFilterChange={handleRoleChange}
                    />
                </div>

                {Alluser.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Alluser.map((ele, i) => {
                            const isVendor = ele.role === 'vendor';
                            const isAdmin = ele.role === 'admin';

                            return (
                                <div
                                    key={ele._id || i}
                                    className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                                >
                                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 ${isAdmin ? 'bg-purple-600' : isVendor ? 'bg-emerald-600' : 'bg-indigo-600'}`}></div>

                                    <div className="flex items-center justify-between mb-6 z-10">
                                        <div className={`p-3.5 rounded-2xl shadow-sm ${isAdmin ? 'bg-purple-50 text-purple-600' : isVendor ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <User strokeWidth={2.5} size={24} />
                                        </div>
                                        <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${isAdmin ? 'bg-purple-50 text-purple-700 border-purple-200' : isVendor ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                            {ele.role}
                                        </span>
                                    </div>

                                    <div className="space-y-5 flex-grow z-10">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 truncate" title={ele.userName}>{ele.userName}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 mt-1.5">
                                                <Mail size={14} className="shrink-0" />
                                                <span className="text-sm font-medium truncate">{ele.email}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-slate-50">
                                                <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                                                    <Phone size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Phone</span>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700 truncate">{ele.phoneNumber || 'N/A'}</p>
                                            </div>
                                            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-slate-50">
                                                <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                                                    <Wallet size={14} />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Wallet</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 truncate">₹{ele.wallet?.toLocaleString() || 0}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between z-10">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <CalendarDays size={14} />
                                            <p className="text-xs font-medium">{ele.createdAt ? new Date(ele.createdAt).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedUser(ele);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1 -mr-2"
                                        >
                                            Details
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                        <Users className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-800">No users found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 w-fit mx-auto">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] transform transition-all duration-300 scale-100 animate-in zoom-in-95">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">User Details Profile</h2>
                                <p className="text-xs text-indigo-100 mt-1">Administrative account audit and statistics</p>
                            </div>
                            <span className="bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                                {selectedUser.role}
                            </span>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                            {/* Profile Grid */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">User ID</span>
                                    <p className="text-sm font-semibold text-slate-800 break-all select-all font-mono">{selectedUser._id}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username</span>
                                    <p className="text-sm font-bold text-slate-800">{selectedUser.userName}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                                    <p className="text-sm font-semibold text-slate-800">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                                    <p className="text-sm font-semibold text-slate-800">{selectedUser.phoneNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Wallet Balance</span>
                                    <p className="text-base font-black text-slate-900">₹{selectedUser.wallet?.toLocaleString() || 0}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Registration Date</span>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* User Bookings Section */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Recent Bookings History</h3>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                                    {myBooking?.filter(b => b.userId === selectedUser._id || b.vendorId === selectedUser._id || b.userId?._id === selectedUser._id || b.vendorId?._id === selectedUser._id).length > 0 ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                    <th className="px-4 py-2.5">Area</th>
                                                    <th className="px-4 py-2.5">Vehicle</th>
                                                    <th className="px-4 py-2.5">Amount</th>
                                                    <th className="px-4 py-2.5">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 text-xs">
                                                {myBooking
                                                    .filter(b => b.userId === selectedUser._id || b.vendorId === selectedUser._id || b.userId?._id === selectedUser._id || b.vendorId?._id === selectedUser._id)
                                                    .slice(0, 10)
                                                    .map((b, idx) => (
                                                        <tr key={b._id || idx} className="hover:bg-slate-50/50 text-slate-700">
                                                            <td className="px-4 py-2.5 font-semibold truncate max-w-[120px]">{b.Area || "N/A"}</td>
                                                            <td className="px-4 py-2.5 font-mono">{b.vehiclesNumber || "N/A"}</td>
                                                            <td className="px-4 py-2.5 font-bold text-slate-900">₹{b.Amount}</td>
                                                            <td className="px-4 py-2.5">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                                    b.status === "Cancelled" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                                                    b.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                                    "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                                                }`}>
                                                                    {b.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-6 text-center text-slate-400 text-sm italic">
                                            No bookings on record for this user account.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors font-bold text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => generateReportPDF("single_user", myBooking, { user: selectedUser })}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2.5 rounded-xl transition-all font-bold text-sm shadow-md shadow-indigo-100"
                            >
                                <FileText size={16} />
                                Download PDF Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}