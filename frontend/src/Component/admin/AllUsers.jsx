import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllUser } from "../../slices/authSlices";
import { User, Phone, Mail, Wallet, Shield } from "lucide-react";

export default function AllUser() {
    const dispatch = useDispatch();
    const { Alluser } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(FetchAllUser());
    }, [dispatch])

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Users</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage and monitor all platform accounts</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-gray-700">{Alluser?.length || 0} Total Members</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Alluser]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, i) => {
                        const isVendor = ele.role === 'vendor';
                        const isAdmin = ele.role === 'admin';
                        
                        return (
                            <div
                                key={i}
                                className="group bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${isAdmin ? 'bg-purple-600' : isVendor ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                                
                                <div className="flex items-start justify-between mb-8">
                                    <div className={`p-4 rounded-2xl shadow-inner ${isAdmin ? 'bg-purple-50 text-purple-600' : isVendor ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <User size={28} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${isAdmin ? 'bg-purple-50 text-purple-700 border-purple-100' : isVendor ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                        {ele.role}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 break-words line-clamp-1">{ele.userName}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                                            <Mail size={14} />
                                            <span className="text-sm font-medium">{ele.email}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <Phone size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Phone</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{ele.phoneNumber || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100/50">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <Wallet size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Wallet</span>
                                            </div>
                                            <p className="text-sm font-black text-gray-900">₹{ele.wallet.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <p className="text-[10px] font-medium text-gray-400">Joined {new Date(ele.createdAt).toLocaleDateString()}</p>
                                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group/btn">
                                            View Details
                                            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
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