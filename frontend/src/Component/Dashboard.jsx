import { useSelector, useDispatch } from "react-redux";
import { UserAccount } from "../slices/authSlices";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import { Car, CalendarDays, CreditCard, Wallet, PlusCircle, CarFront, Inbox, ClipboardList, ShieldAlert, BadgeCheck } from "lucide-react";

function DashBoard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(UserAccount());
    }, [dispatch]);

    const { user } = useSelector((state) => state.auth);

    if (!user) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xl font-bold text-slate-500">Loading Dashboard...</p>
            </div>
        </div>
    );

    const roleColors = {
        admin: "text-purple-700 bg-purple-100 border-purple-200",
        vendor: "text-emerald-700 bg-emerald-100 border-emerald-200",
        user: "text-indigo-700 bg-indigo-100 border-indigo-200",
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between mb-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-indigo-600"></div>
                <div className="pl-4">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{user.userName}</span>!
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Here's a quick overview of your account today.</p>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col items-end">
                    <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border shadow-sm flex items-center gap-1.5 ${roleColors[user.role]}`}>
                        <BadgeCheck size={16} />
                        {user.role} Account
                    </span>
                    <p className="text-slate-400 mt-3 text-sm font-semibold">{user.email}</p>
                </div>
            </div>

            {user.role === "admin" ? (
                <div className="mt-6">
                    <AdminDashboard />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {user.role === "user" && (
                        <>
                            <Link to="/bookSlot" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Book a Slot</h3>
                                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shadow-sm border border-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <Car size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">Find and reserve a parking space quickly and securely.</p>
                            </Link>

                            <Link to="/mybookings" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">My Bookings</h3>
                                    <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl shadow-sm border border-indigo-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <CalendarDays size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">View and manage all your upcoming parking reservations.</p>
                            </Link>

                            <Link to="/mypayments" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">Payment History</h3>
                                    <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl shadow-sm border border-emerald-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <CreditCard size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">Check your past transactions and retrieve receipts instantly.</p>
                            </Link>

                            {user.wallet !== undefined && (
                                <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2 pl-2">Wallet Balance</h2>
                                    <div className="flex items-center justify-between pl-2">
                                        <h1 className="text-5xl font-black text-slate-800 tracking-tight">₹{user.wallet}</h1>
                                        <div className="bg-emerald-50 text-emerald-600 p-5 rounded-2xl shadow-sm border border-emerald-100">
                                            <Wallet size={36} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {user.role === "vendor" && (
                        <>
                            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                                <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2 pl-2">Wallet Balance</h2>
                                <div className="flex items-center justify-between pl-2">
                                    <h1 className="text-5xl font-black text-slate-800 tracking-tight">₹{user.wallet}</h1>
                                    <div className="bg-emerald-50 text-emerald-600 p-5 rounded-2xl shadow-sm border border-emerald-100">
                                        <Wallet size={36} />
                                    </div>
                                </div>
                            </div>

                            <Link to="/addparkingslot" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Add Slot</h3>
                                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl shadow-sm border border-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <PlusCircle size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">List a new beautiful parking space for users to book.</p>
                            </Link>

                            <Link to="/mySlot" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">My Slots</h3>
                                    <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl shadow-sm border border-purple-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <CarFront size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">Manage your existing parking slots, pricing, and availability.</p>
                            </Link>

                            <Link to="/mybookings" className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Bookings Received</h3>
                                    <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl shadow-sm border border-orange-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <Inbox size={32} />
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium">Keep track of the slots booked by your customers.</p>
                            </Link>
                        </>
                    )}
                </div>
            )}

            {user.role !== "admin" && (
                <div className="mt-10 bg-white shadow-lg shadow-slate-200/40 border border-slate-100 rounded-3xl p-10 relative overflow-hidden">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                        <ClipboardList className="text-indigo-600" size={28} />
                        Recent Activity
                    </h2>
                    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
                        <div className="mb-4 text-slate-300">
                            <ShieldAlert size={64} />
                        </div>
                        <p className="text-slate-500 font-bold text-lg text-center">No recent major activity to show right now.</p>
                        <p className="text-slate-400 text-sm mt-2 text-center font-medium">Wait until some operations take place to see logs here.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashBoard;