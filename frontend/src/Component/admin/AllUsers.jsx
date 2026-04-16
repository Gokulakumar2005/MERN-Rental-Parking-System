import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllUser } from "../../slices/authSlices";
import Pagination from "../../config/pagination";
import { User, Phone, Mail, Wallet, Users, ArrowRight, Activity, CalendarDays } from "lucide-react";

export default function AllUser() {
    const dispatch = useDispatch();
    const { Alluser, pagination } = useSelector((state) => state.auth);
    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};

    const handlePageChange = (page) => {
        dispatch(FetchAllUser({ page, limit: 24 }));
    };

    useEffect(() => {
        dispatch(FetchAllUser({ page: 1, limit: 24 }));
    }, [dispatch]);

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
                        <span className="font-bold text-slate-700">{Alluser?.length || 0} Members</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(Alluser || [])?.slice()?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, i) => {
                        const isVendor = ele.role === 'vendor';
                        const isAdmin = ele.role === 'admin';

                        return (
                            <div
                                key={i}
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
                                        <p className="text-xs font-medium">{new Date(ele.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1 -mr-2">
                                        Details
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-center mt-8 w-fit mx-auto">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
}

// createdAt
// :
// "2026-04-05T04:56:05.681Z"
// email
// :
// "admin@gmail.com"
// password
// :
// "$2b$10$Nucz3R95bsAAcsRp5F8R6.ophZuIV0zHjILq2kiTOLUDjBFtr.Yj6"
// phoneNumber
// :
// "9655986400"
// profilePic
// :
// ""
// role
// :
// "admin"
// updatedAt
// :
// "2026-04-05T04:56:05.681Z"
// userName
// :
// "admin"
// wallet
// :
// 0
// __v
// :
// 0
// _id
// :
// "69d1eb65081d4e8bda7bb27b"