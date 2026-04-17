import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import { fetchBookings } from "../../slices/BookingSlices";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, } from "react-leaflet";
import { ArrowLeft, Navigation, Map as MapIcon, SlidersHorizontal,Car } from "lucide-react";
import axios from "../../config/axiosInstance";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo([center.lat, center.lng], 13, { animate: true });
        }
    }, [center, map]);
    return null;
};

export default function AllUserInMap() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [serverError, setServerError] = useState(null);
    const [Slot, setAllSlot] = useState([]); 
    const [myBooking, setAllBooking] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [radius, setRadius] = useState(10); 


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.log("Geolocation error:", error)
        );
    }, []);

    const fetchAllSlotWithoutPagination = async () => {
        try {
            const response = await axios.get("/fetch/allSlot/maps", { headers: { Authorization: localStorage.getItem("token") } });
            setAllSlot(response.data); 
        } catch (error) {
            setServerError(error.response?.data?.error || "Unable to fetch slots");
        }
    }

    const fetchAllBookingWithoutPagination = async () => {
        try {
            const response = await axios.get("/fetch/allBooking/maps", { headers: { Authorization: localStorage.getItem("token") } });
            setAllBooking(response.data); 
        } catch (error) {
            setServerError(error.response?.data?.error || "Unable to fetch bookings");
        }
    }

    useEffect(() => {
        fetchAllSlotWithoutPagination();
        fetchAllBookingWithoutPagination();
    }, [dispatch])

    const getAvailableSlots = (slotId, totalSlots) => {
        const bookedCount = myBooking
            .filter(b => b.slotId === slotId && b.status === "Booked")
            .reduce((acc, b) => acc + (b.BookedSlots?.length || 0), 0);
        return totalSlots - bookedCount;
    };


    const filteredSlots = Slot?.filter((lot) => {
        if (!currentLocation || !lot.location?.geo) return true;
        const dist = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            lot.location.geo.lat,
            lot.location.geo.lng
        );
        return dist <= radius;
    });

    return (
        <div className="min-h-screen bg-slate-50 p-6 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white hover:bg-slate-50 rounded-2xl shadow-sm border border-slate-200 transition-all active:scale-95 cursor-pointer"
                        >
                            <ArrowLeft size={22} className="text-slate-600" />
                        </button>
                        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                                <MapIcon size={20} className="text-indigo-600" />
                                Discovery Radar
                            </h3>
                        </div>
                    </div>

                    <div className="w-full md:w-auto bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <SlidersHorizontal size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Radius: {radius} KM</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={radius} 
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                            className="w-full sm:w-64 h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                </div>

                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-white bg-white p-2">
                    <MapContainer
                        center={[
                            currentLocation?.lat || Slot?.[0]?.location?.geo?.lat || 12.9716,
                            currentLocation?.lng || Slot?.[0]?.location?.geo?.lng || 77.5946
                        ]}
                        zoom={12}
                        style={{ height: "600px", width: "100%", borderRadius: "2rem" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        {/* Auto-recenter when location found */}
                        <RecenterMap center={currentLocation} />

                        {/* User Current Location Marker */}

                        {currentLocation && (
                            <>
                                <Marker position={[currentLocation.lat, currentLocation.lng]}>
                                    <Popup><span className="font-bold">You are here</span></Popup>
                                </Marker>
                                <Circle 
                                    center={[currentLocation.lat, currentLocation.lng]} 
                                    radius={radius * 1000}
                                    pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.1, weight: 1 }}
                                />
                            </>
                        )}

                        {filteredSlots?.map((lot) => (
                            <Marker
                                key={lot._id}
                                position={[
                                    lot.location?.geo?.lat,
                                    lot.location?.geo?.lng
                                ]}
                            >
                                <Popup>
                                    <div className="p-2 min-w-[180px]">
                                        <h4 className="font-black text-slate-900 border-b border-slate-100 pb-2 mb-2">{lot.name}</h4>
                                        <div className="space-y-1.5">
                                            {currentLocation && (
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Navigation size={10} /> {calculateDistance(currentLocation.lat, currentLocation.lng, lot.location.geo.lat, lot.location.geo.lng).toFixed(1)} KM Away
                                                </p>
                                            )}
                                            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                                <Car size={10} className="text-indigo-500" /> {lot.vehicles}
                                            </p>

                                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                                <span className="text-[10px] font-black text-slate-400 uppercase">Available</span>
                                                <span className={`font-black text-xs ${getAvailableSlots(lot._id, lot.totalSlot) > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                                    {getAvailableSlots(lot._id, lot.totalSlot)} Slots
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate("/slotbookingpage", { state: lot })}
                                            className="w-full mt-3 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all cursor-pointer shadow-lg shadow-indigo-100"
                                        >
                                            Book Space
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
