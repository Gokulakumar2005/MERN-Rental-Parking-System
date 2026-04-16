import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSlots, deleteSlot } from "../../slices/parkingSlot";
import { useNavigate } from "react-router-dom";
import Pagination from "../../config/pagination";
import { MapPin, Car, LayoutGrid, Pencil, Trash2, ParkingCircle, Plus } from "lucide-react";

export default function MySlot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { Slot, pagination } = useSelector((state) => state.slot);
    const { user } = useSelector((state) => state.auth);
    const { currentPage = 1, totalPages = 1 } = pagination || {};

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-slate-50">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 animate-spin">
                    <ParkingCircle size={32} />
                </div>
            </div>
        );
    }

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 24 }));
    };

    useEffect(() => {
        dispatch(FetchSlots({ page: 1, limit: 24 }));
    }, [dispatch]);

    const CommonId = user
        ? Slot.filter((ele) => String(ele.vendorId) === String(user._id))
        : [];
    console.log({ "Common ID ": CommonId });

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this slot?");
        if (confirmDelete) {
            dispatch(deleteSlot(id));
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
                                <ParkingCircle size={24} />
                            </div>
                            My Parking Slots
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 ml-14">Manage your registered parking facilities</p>
                    </div>
                    <button
                        onClick={() => navigate("/addparkingslot")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-sm text-sm cursor-pointer flex-shrink-0"
                    >
                        <Plus size={16} /> Add New Slot
                    </button>
                </div>

                {CommonId.length !== 0 ? (
                    <div className="grid gap-5 md:grid-cols-2">
                        {[...CommonId]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((ele) => (
                                <div
                                    key={ele._id}
                                    className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-6 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100 flex-shrink-0">
                                            <MapPin size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-xl font-extrabold text-slate-800 truncate">{ele.name}</h2>
                                            <p className="text-sm text-slate-500 font-medium mt-1 truncate">{ele.address}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Car size={12} /> Vehicles
                                            </p>
                                            <p className="font-bold text-slate-700 capitalize">{ele.vehicles}</p>
                                        </div>
                                        <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <LayoutGrid size={12} /> Total Slots
                                            </p>
                                            <p className="text-xl font-extrabold text-emerald-600">{ele.totalSlot}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate("/addparkingslot", { state: ele })}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm cursor-pointer"
                                        >
                                            <Pencil size={14} /> Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ele._id)}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 font-bold rounded-xl hover:bg-rose-100 transition text-sm cursor-pointer"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        <div className="col-span-full mt-4">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-slate-300">
                            <ParkingCircle size={40} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800">No slots registered yet</h3>
                        <p className="text-slate-500 font-medium mt-2 mb-6">Register your first parking slot to start managing bookings.</p>
                        <button
                            onClick={() => navigate("/addparkingslot")}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                        >
                            <Plus size={18} /> Register a Slot
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}