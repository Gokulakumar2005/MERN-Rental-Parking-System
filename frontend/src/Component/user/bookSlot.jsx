import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FetchSlots } from "../../slices/parkingSlot.jsx";
import { fetchBookings } from "../../slices/BookingSlices.jsx";
import MyMap from "../../config/mapComponent.jsx";
import Pagination from "../../config/pagination.jsx";
import SearchBar from "../SearchBar";
import { MapPin, Car, Tag, Map, Info, Image, BookOpen, ChevronDown, ChevronUp, AlertTriangle, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";


import debounce from "lodash/debounce";

export default function BookSlot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { Slot: SlotInfo, pagination: slotPagination, error: reduxError } = useSelector((state) => state.slot);
    const { myBooking } = useSelector((state) => state.booking);
    const [serverError, setServerError] = useState(null);

    const { currentPage = 1, totalPages = 1 } = slotPagination || {};

    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);

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
    const [activeImage, setActiveImage] = useState({});
    const [vehicleType, setVehicleType] = useState("all");

    const debouncedFetch = useCallback(
        debounce((searchQuery) => {
            dispatch(FetchSlots({ page: 1, limit: 12, search: searchQuery }));
        }, 500),
        [dispatch]
    );

    const handleSearchChange = (value) => {
            setSearch(value);
            debouncedFetch(value, vehicleType);
        };
    
        const handleVehicleChange = (value) => {
            setVehicleType(value);
            dispatch(FetchSlots({ page: 1, limit: 12, search, vehicleType: value }));
        };

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 24, search }));
        dispatch(fetchBookings({ page, limit: 24 }));
    };

    const filters = [
        { label: "All Vehicles", value: "all" },
        { label: "Cars Only", value: "car" },
        { label: "Bikes Only", value: "bike" }
    ];

    useEffect(() => {
        dispatch(FetchSlots({ page: 1, limit: 24, search: initialSearch }));
        dispatch(fetchBookings({ page: 1, limit: 24 }));
    }, [dispatch, initialSearch]);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


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
                <div className="max-w-xl">
                    <SearchBar
                        placeholder="Search by name, address or area..."
                        value={search}
                        onChange={handleSearchChange}
                        filters={filters}
                        activeFilter={vehicleType}
                        onFilterChange={handleVehicleChange}
                    />
                </div>

                {serverError && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Availability Service Alert</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "Unable to retrieve real-time parking data."}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setServerError(null);
                                dispatch(FetchSlots({ page: 1, limit: 24, search }));
                                dispatch(fetchBookings({ page: 1, limit: 24 }));
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span>Retry</span>
                        </button>
                    </div>
                )}


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
                                                <div className="border-t border-slate-100 bg-slate-50 p-6">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Space Gallery</p>

                                                    <div className="relative group overflow-hidden rounded-3xl bg-slate-200">
                                                        <img
                                                            src={ele.parkingImages[activeImage[ele._id] || 0]}
                                                            alt="featured-parking"
                                                            className="w-full h-80 object-cover transition-all duration-700 hover:scale-105"
                                                        />

                    
                                                        {ele.parkingImages.length > 1 && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        const curr = activeImage[ele._id] || 0;
                                                                        const prev = (curr - 1 + ele.parkingImages.length) % ele.parkingImages.length;
                                                                        setActiveImage({ ...activeImage, [ele._id]: prev });
                                                                    }}
                                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 text-slate-800 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 hover:bg-white transition-all active:scale-95 cursor-pointer"
                                                                >
                                                                    <ChevronLeft size={20} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const curr = activeImage[ele._id] || 0;
                                                                        const next = (curr + 1) % ele.parkingImages.length;
                                                                        setActiveImage({ ...activeImage, [ele._id]: next });
                                                                    }}
                                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer"
                                                                >
                                                                    <ChevronRight size={20} />
                                                                </button>

                                                            </>
                                                        )}

                                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                                                            Image {(activeImage[ele._id] || 0) + 1} of {ele.parkingImages.length}
                                                        </div>
                                                    </div>

                                           
                                                    <div className="flex gap-3 overflow-x-auto mt-4 pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                        {ele.parkingImages.map((img, i) => (
                                                            <div
                                                                key={i}
                                                                onClick={() => setActiveImage({ ...activeImage, [ele._id]: i })}
                                                                className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${(activeImage[ele._id] || 0) === i ? "ring-2 ring-indigo-600 ring-offset-2 scale-95" : "opacity-60 hover:opacity-100"}`}
                                                            >
                                                                <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
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