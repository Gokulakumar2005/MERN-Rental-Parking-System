import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import { fetchBookings } from "../../slices/BookingSlices";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ArrowLeft } from "lucide-react";


export default function AllUserInMap() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchSlots());
        dispatch(fetchBookings())
    }, [dispatch])

    const { Slot } = useSelector((state) => state.slot)
    const { myBooking } = useSelector((state) => state.booking);

    const getAvailableSlots = (slotId, totalSlots) => {
        const bookedCount = myBooking
            .filter(b => b.slotId === slotId && b.status === "Booked")
            .reduce((acc, b) => acc + b.BookedSlots?.length, 0);

        return totalSlots - bookedCount;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="bg-white shadow-sm border border-gray-200 px-6 py-3 rounded-xl flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800">Parking Slots Map</h3>
                </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <MapContainer
                    center={[
                        Slot?.[0]?.location?.geo?.lat || 12.9716,
                        Slot?.[0]?.location?.geo?.lng || 77.5946
                    ]}
                    zoom={13}
                    style={{ height: "500px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {Slot?.map((lot) => (
                        <Marker
                            key={lot._id}
                            position={[
                                lot.location?.geo?.lat,
                                lot.location?.geo?.lng
                            ]}
                        >
                            <Popup>
                                  <p> <strong>Venue Name :</strong>{lot.name}</p>
                                 <p> <strong>  vehicles :</strong>{lot. vehicles}</p>
                                <p> <strong>Available Slot:</strong>{getAvailableSlots(lot._id, lot.totalSlot)}</p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}