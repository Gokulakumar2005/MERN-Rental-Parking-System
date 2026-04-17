import { useSelector, useDispatch } from "react-redux";
import { UserAccount } from "../slices/authSlices";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import SearchBar from "./SearchBar";
import { Car, CalendarDays, CreditCard, Wallet, PlusCircle, CarFront, Inbox, ClipboardList, ShieldAlert, BadgeCheck, Search, ArrowRight, RefreshCcw, AlertTriangle } from "lucide-react";


function DashBoard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const { user, Error: reduxError } = useSelector((state) => state.auth);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        dispatch(UserAccount());
    }, [dispatch]);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


    const userLinks = [
        {
            to: "/bookSlot",
            title: "Book a Slot",
            description: "Find and reserve a parking space quickly and securely.",
            icon: <Car size={32} />,
            color: "blue"
        },
        {
            to: "/mybookings",
            title: "My Bookings",
            description: "View and manage all your upcoming parking reservations.",
            icon: <CalendarDays size={32} />,
            color: "indigo"
        },
        {
            to: "/mypayments",
            title: "Payment History",
            description: "Check your past transactions and retrieve receipts instantly.",
            icon: <CreditCard size={32} />,
            color: "emerald"
        }
    ];

    const vendorLinks = [
        {
            to: "/addparkingslot",
            title: "Add Slot",
            description: "List a new beautiful parking space for users to book.",
            icon: <PlusCircle size={32} />,
            color: "blue"
        },
        {
            to: "/mySlot",
            title: "My Slots",
            description: "Manage your existing parking slots, pricing, and availability.",
            icon: <CarFront size={32} />,
            color: "purple"
        },
        {
            to: "/mybookings",
            title: "Bookings Received",
            description: "Keep track of the slots booked by your customers.",
            icon: <Inbox size={32} />,
            color: "orange"
        }
    ];

    const filteredLinks = useMemo(() => {
        const links = user?.role === "user" ? userLinks : user?.role === "vendor" ? vendorLinks : [];
        if (!searchQuery) return links;
        return links.filter(link =>
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [user?.role, searchQuery]);

    if (!user) return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xl font-bold text-slate-500">Loading Dashboard...</p>
            </div>
        </div>
    );

    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            if (user.role === 'admin') {
                navigate(`/allUsers?search=${searchQuery}`);
            } else if (user.role === 'user') {
                navigate(`/bookSlot?search=${searchQuery}`);
            } else if (user.role === 'vendor') {
                navigate(`/mySlot?search=${searchQuery}`);
            }
        }
    };

    const roleColors = {
        admin: "text-purple-700 bg-purple-100 border-purple-200",
        vendor: "text-emerald-700 bg-emerald-100 border-emerald-200",
        user: "text-indigo-700 bg-indigo-100 border-indigo-200",
    };

    return (
        <div className="max-w-7xl mx-auto mt-6 p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {serverError && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                            <AlertTriangle size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Account Synchronization Issue</h3>
                            <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "Unable to load account details. Please try again."}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setServerError(null);
                            dispatch(UserAccount());
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                    >
                        <RefreshCcw size={16} />
                        <span className="hidden sm:inline">Reconnect</span>
                    </button>
                </div>
            )}

            {/* Header Section */}

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


            <div className="mb-10 max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="search"
                        placeholder={user.role === 'admin' ? "Quick search users, bookings or slots..." : "Find a feature or search the platform..."}
                        className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm text-lg font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleGlobalSearch}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <kbd className="hidden sm:inline-flex items-center px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 gap-1">
                            <span>Press</span>
                            <ArrowRight size={12} />
                            <span>Enter</span>
                        </kbd>
                    </div>
                </div>
                <p className="mt-3 text-center text-slate-400 text-sm font-medium">
                    {user.role === 'admin' ? "Searches users directory by default" : "Quickly jump to any tool or feature"}
                </p>
            </div>

            {user.role === "admin" ? (
                <div className="mt-6">
                    <AdminDashboard />
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Wallet Section for User/Vendor */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                        <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2 pl-2">Wallet Balance</h2>
                        <div className="flex items-center justify-between pl-2">
                            <h1 className="text-5xl font-black text-slate-800 tracking-tight">₹{user.wallet?.toLocaleString() || 0}</h1>
                            <div className="bg-emerald-50 text-emerald-600 p-5 rounded-2xl shadow-sm border border-emerald-100 shadow-emerald-100">
                                <Wallet size={36} />
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    {filteredLinks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
                            {filteredLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.to}
                                    className="group bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${link.color === 'blue' ? 'from-blue-400 to-blue-600' :
                                        link.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                                            link.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                                                link.color === 'purple' ? 'from-purple-400 to-purple-600' :
                                                    'from-orange-400 to-orange-600'
                                        } scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>

                                    <div className="flex items-start justify-between mb-6">
                                        <h3 className={`text-2xl font-bold text-slate-800 group-hover:text-${link.color}-600 transition-colors`}>{link.title}</h3>
                                        <div className={`bg-${link.color}-50 text-${link.color}-600 p-4 rounded-2xl shadow-sm border border-${link.color}-100 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                            {link.icon}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 font-medium">{link.description}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                            <Search className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-slate-800">No tools found</h3>
                            <p className="text-slate-500">We couldn't find any feature matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

            {user.role !== "admin" && (
                <div className="mt-10 bg-white shadow-lg shadow-slate-200/40 border border-slate-100 rounded-3xl p-10 relative overflow-hidden">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                        <ClipboardList className="text-indigo-600" size={28} />
                        Recent Activity
                    </h2>
                    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 font-medium">
                        <div className="mb-4 text-slate-300">
                            <ShieldAlert size={64} />
                        </div>
                        <p className="text-slate-500 font-bold text-lg text-center">No recent major activity to show right now.</p>
                        <p className="text-slate-400 text-sm mt-2 text-center">Wait until some operations take place to see logs here.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DashBoard;