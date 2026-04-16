import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FetchSlots } from "../../slices/parkingSlot.jsx";
import { fetchBookings } from "../../slices/BookingSlices.jsx";
import MyMap from "../../config/mapComponent.jsx";
import Pagination from "../../config/pagination.jsx";
import { MapPin, Car, Tag, Map, Info, Image, BookOpen, ChevronDown, ChevronUp } from "lucide-react";

export default function BookSlot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { Slot: SlotInfo, pagination: slotPagination } = useSelector((state) => state.slot);
    const { myBooking } = useSelector((state) => state.booking);

    const { currentPage = 1, totalPages = 1 } = slotPagination || {};

    const getAvailableSlots = (slotId, totalSlots) => {
        const bookedCount = myBooking
            .filter(b => String(b.slotId) === String(slotId) && b.status === "Booked")
            .reduce((acc, b) => acc + (b.BookedSlots?.length || 0), 0);

        return totalSlots - bookedCount;
    };

    const [showPricing, setPricing] = useState(null);
    const [showDetails, setDetails] = useState(null);
    const [showImages, setShowImages] = useState(null);
    const [showMap, setShowMap] = useState(null);

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 24 }));
        dispatch(fetchBookings({ page, limit: 24 }));
    };

    useEffect(() => {
        handlePageChange(1);
    }, []);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
                                <Car size={24} />
                            </div>
                            Find a Parking Slot
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 ml-14">Browse available parking spaces and reserve your spot</p>
                    </div>
                    <button
                        onClick={() => navigate("/AllUserInMap")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-sm text-sm cursor-pointer flex-shrink-0"
                    >
                        <Map size={16} /> View on Map
                    </button>
                </div>

                {SlotInfo.length !== 0 ? (
                    <div className="grid gap-5">
                        {SlotInfo.map((ele, index) => {
                            const available = getAvailableSlots(ele._id, ele.totalSlot);
                            const isPricingOpen = showPricing === index;
                            const isDetailsOpen = showDetails === index;
                            const isMapOpen = showMap === index;
                            const isImagesOpen = showImages === index;

                            return (
                                <div key={ele._id} className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 border border-indigo-100 flex-shrink-0">
                                                    <MapPin size={22} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-extrabold text-slate-800">{ele?.name}</h2>
                                                    <p className="text-sm text-slate-500 font-medium mt-1">{ele?.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p>
                                                    <p className={`text-2xl font-extrabold ${available > 0 ? "text-emerald-600" : "text-rose-500"}`}>{available}</p>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${available > 0 ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"}`}>
                                                    {available > 0 ? "Open" : "Full"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{ele?.vehicles}</span>
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{ele.totalSlot} total slots</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setPricing(isPricingOpen ? null : index)}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${isPricingOpen ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
                                            >
                                                <Tag size={14} /> Pricing {isPricingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <button
                                                onClick={() => setShowMap(isMapOpen ? null : index)}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${isMapOpen ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                                            >
                                                <Map size={14} /> Map {isMapOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <button
                                                onClick={() => setDetails(isDetailsOpen ? null : index)}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${isDetailsOpen ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100"}`}
                                            >
                                                <Info size={14} /> Details {isDetailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                            <button
                                                onClick={() => navigate("/slotbookingpage", { state: ele })}
                                                disabled={available === 0}
                                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ml-auto cursor-pointer"
                                            >
                                                <BookOpen size={14} /> Book Now
                                            </button>
                                        </div>
                                    </div>

                                    {isPricingOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 p-5 grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Hourly", value: ele?.pricing?.hourly, color: "indigo" },
                                                { label: "Daily", value: ele?.pricing?.daily, color: "emerald" },
                                                { label: "Monthly", value: ele?.pricing?.monthly, color: "purple" },
                                            ].map(({ label, value, color }) => (
                                                <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-2xl p-4 text-center`}>
                                                    <p className={`text-xs font-bold text-${color}-400 uppercase tracking-wider mb-1`}>{label}</p>
                                                    <p className={`text-xl font-extrabold text-${color}-700`}>₹{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isDetailsOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 p-5">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Facilities</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {ele.facilities.map((f, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm">{f}</span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setShowImages(isImagesOpen ? null : index)}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${isImagesOpen ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700 hover:bg-orange-100"}`}
                                            >
                                                <Image size={14} /> {isImagesOpen ? "Hide Images" : "Show Images"}
                                            </button>
                                            {isImagesOpen && (
                                                <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
                                                    {ele.parkingImages.map((img, i) => (
                                                        <img key={i} src={img} alt={`parking-${i}`} className="w-40 h-28 object-cover rounded-2xl flex-shrink-0 border border-slate-200 shadow-sm" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isMapOpen && (
                                        <div className="border-t border-slate-100 h-[350px]">
                                            <MyMap
                                                location={{
                                                    lat: ele.location?.geo?.lat,
                                                    lng: ele.location?.geo?.lng
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="mt-4">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 p-16 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-slate-300">
                            <Car size={40} />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-800">No parking slots available</h3>
                        <p className="text-slate-500 font-medium mt-2">Check back later or try viewing the map for nearby options.</p>
                    </div>
                )}
            </div>
        </div>
    );
}