

import { useSelector } from "react-redux";
import { UserAccount } from "../slices/authSlices";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DashBoard() {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    useEffect(() => {
        dispatch(UserAccount());
    }, [dispatch])
    
    const { user } = useSelector((state) => state.auth);
const  loginRedirect=()=>{
    navigate("/login")
}
    if (!user) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <p className="text-xl font-semibold text-gray-500 animate-pulse">Loading Dashboard...</p>
        </div>
    );

    const roleColors = {
        admin: "text-purple-700 bg-purple-100 border-purple-200",
        vendor: "text-green-700 bg-green-100 border-green-200",
        user: "text-blue-700 bg-blue-100 border-blue-200",
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                <div className="pl-4">
                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{user.userName}</span>!
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-medium">Here's a quick overview of your account today.</p>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col items-end">
                    <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border shadow-sm ${roleColors[user.role]}`}>
                        {user.role} Account
                    </span>
                    <p className="text-gray-400 mt-3 text-sm font-medium">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
                {user.role === "user" && (
                    <>
                        <Link to="/bookSlot" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Book a Slot</h3>
                                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">🚗</div>
                            </div>
                            <p className="text-gray-500 font-medium">Find and reserve a parking space quickly and securely.</p>
                        </Link>
                        
                        <Link to="/mybookings" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">My Bookings</h3>
                                <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">📅</div>
                            </div>
                            <p className="text-gray-500 font-medium">View and manage all your upcoming parking reservations.</p>
                        </Link>

                        <Link to="/mypayments" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Payment History</h3>
                                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">💳</div>
                            </div>
                            <p className="text-gray-500 font-medium">Check your past transactions and retrieve receipts instantly.</p>
                        </Link>
                        {user.wallet !== undefined && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
                                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                                <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 pl-2">Wallet Balance</h2>
                                <div className="flex items-center justify-between pl-2">
                                    <h1 className="text-5xl font-black text-gray-800 tracking-tight">₹{user.wallet}</h1>
                                    <div className="bg-green-50, text-green-600 p-5 rounded-2xl text-3xl shadow-inner">💰</div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {user.role === "vendor" && (
                    <>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
                             <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600"></div>
                            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2 pl-2">Wallet Balance</h2>
                            <div className="flex items-center justify-between pl-2">
                                <h1 className="text-5xl font-black text-gray-800 tracking-tight">₹{user.wallet}</h1>
                                <div className="bg-green-50 text-green-600 p-5 rounded-2xl text-3xl shadow-inner">💰</div>
                            </div>
                        </div>

                        <Link to="/addparkingslot" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Add Slot</h3>
                                <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">➕</div>
                            </div>
                            <p className="text-gray-500 font-medium">List a new beautiful parking space for users to book.</p>
                        </Link>

                        <Link to="/mySlot" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">My Slots</h3>
                                <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">🅿️</div>
                            </div>
                            <p className="text-gray-500 font-medium">Manage your existing parking slots, pricing, and availability.</p>
                        </Link>

                        <Link to="/mybookings" className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">Bookings Received</h3>
                                <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform">📥</div>
                            </div>
                            <p className="text-gray-500 font-medium">Keep track of the slots booked by your customers.</p>
                        </Link>
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">System Activity</h3>
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-2xl shadow-inner">⚙️</div>
                            </div>
                            <p className="text-gray-500 font-medium">Manage active platforms, verify vendors, and oversee users.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Financial Overview</h3>
                                <div className="bg-teal-50 text-teal-600 p-4 rounded-2xl text-2xl shadow-inner">📈</div>
                            </div>
                            <p className="text-gray-500 font-medium">View platform commissions and global transaction volumes.</p>
                        </div>
                    </>
                )}
            </div>
            

            <div className="mt-10 bg-white shadow-sm border border-gray-200 rounded-3xl p-10 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                    <svg width="400" height="400" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Recent Activity</h2>
                <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                    <div className="text-5xl mb-4 opacity-50">📋</div>
                    <p className="text-gray-500 font-medium text-lg text-center">No recent major activity to show right now.</p>
                    <p className="text-gray-400 text-sm mt-2 text-center">Wait until some operations take place to see logs here.</p>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;