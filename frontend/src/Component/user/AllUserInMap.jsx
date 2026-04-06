import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import { fetchBookings } from "../../slices/BookingSlices";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


export default function AllUserInMap() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchSlots());
        dispatch(fetchBookings())
    }, [dispatch])

    const { Slot } = useSelector((state) => state.slot)
    const lat = Slot?.[0]?.location?.geo?.lat;
    const lng = Slot?.[0]?.location?.geo?.lng;
    // console.log({ "lat": lat, "lng": lng })

    const { myBooking } = useSelector((state) => state.booking);

    const getAvailableSlots = (slotId, totalSlots) => {
        const bookedCount = myBooking
            .filter(b => b.slotId === slotId && b.status === "Booked")
            .reduce((acc, b) => acc + b.BookedSlots?.length, 0);

        return totalSlots - bookedCount;
    };

    return (
        <div>
            <div>
                <button onClick={() => navigate(-1)}
                    className="bg-gray-600 text-white-900 rounded-full w-15 h-8 "
                >Back</button>
            </div>
            <center><h3>Slot's In Maps </h3></center>
            <div>
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