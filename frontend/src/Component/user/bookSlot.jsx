

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FetchSlots } from "../../slices/parkingSlot.jsx";
// import { fetchBookings } from "../../slices/BookingSlices.jsx";
// import MyMap from "../../config/mapComponent.jsx";

// export default function BookSlot() {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const SlotInfo = useSelector((state) => state.slot.Slot);
//     const { myBooking, pagination } = useSelector((state) => state.booking);
//     const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};
//     const getAvailableSlots = (slotId, totalSlots) => {
//         const bookedCount = myBooking
//             .filter(b => b.slotId === slotId && b.status === "Booked")
//             .reduce((acc, b) => acc + b.BookedSlots?.length, 0);

//         return totalSlots - bookedCount;
//     };

//     const [showPricing, setPricing] = useState(null);
//     const [showDetails, setDetails] = useState(null);

//     const [showImages, setShowImages] = useState(null);
//     const [showMap, setShowMap] = useState(null);
//     const handlePageChange = (page) => {
//         dispatch(fetchBookings({ page, limit: 24 }));
//         dispatch(FetchSlots({ page, limit: 24 }));
//     };

//     useEffect(() => {
//         dispatch(FetchSlots({ page:1, limit: 24 }));
//         dispatch(fetchBookings({ page:1, limit: 24 }));
//     }, [dispatch]);

//     const [formData, setFormData] = useState({
//         vehicletype: "",
//         vehiclesNumber: "",
//         SlotCount: "",
//         Based: "",
//         startTime: "",
//         endTime: "",
//         Amount: ""
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = (e, ele) => {
//         e.preventDefault();

//         console.log("Booking Data:", formData, ele);

//         // 👉 dispatch booking action here
//         // dispatch(createBooking({...formData, slotId: ele._id}))
//     };

//     return (
//         <div className="min-h-screen bg-yellow-100 flex justify-start items-start">

//             <div className="flex justify-end">
//                 <button onClick={() => navigate("/AllUserInMap")}
//                     className="bg-blue-400 text-gray-700 rounded-full flex justify-end ">Find SlotS</button>
//             </div>
//             {SlotInfo.length !== 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 p-6 w-full">
//                     {[...SlotInfo].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, index) => (
//                         <div key={index} className="bg-blue-200 rounded-xl shadow-md p-4 hover:shadow-lg transition">
//                             <div className="space-y-1">
//                                 <p><strong className="text-gray-700">Slot Name:</strong> {ele?.name}</p>
//                                 <p><strong className="text-gray-700">Address:</strong> {ele?.address}</p>
//                                 <p><strong className="text-gray-700">Vehicles:</strong> {ele?.vehicles}</p>
//                                 <p> <strong>Available Slot:</strong>{getAvailableSlots(ele?._id, ele?.totalSlot)}</p>
//                             </div>
//                             <div className="flex flex-wrap gap-2 mt-4">
//                                 <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                                     onClick={() => setPricing(showPricing === index ? null : index)} >View Pricing </button>
//                                 <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                                     onClick={() => setShowMap(showMap === index ? null : index)}> Show Map </button>
//                                 <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
//                                     onClick={() => setDetails(showDetails === index ? null : index)}> Details </button>
//                                 <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
//                                     onClick={() => navigate("/slotbookingpage", { state: ele })}>  Book </button>
//                             </div>
//                             <div className="mt-3">
//                                 {Booked === index && (
//                                     <div className="bg-gray-100 p-3 rounded">
//                                         <p>Booking A  Slot For Parking ....!</p>

//                                         <form
//                                             className="mt-3 space-y-4"
//                                             onSubmit={(e) => handleSubmit(e, ele)}
//                                         >
//                                             <div>
//                                                 <label>
//                                                     <input type="radio" value="Car" name="vehicletype" checked={formData.vehicletype === 'Car'} onChange={handleChange} /> Car
//                                                 </label>
//                                                 <br />
//                                                 <label>
//                                                     <input type="radio" value="Bike" name="vehicletype" checked={formData.vehicletype === 'Bike'} onChange={handleChange} /> Bike
//                                                 </label>
//                                             </div>
//                                             <div>
//                                                 <label> Number of Vehicles:
//                                                     <input type="text" name="vehiclesNumber" value={formData.vehiclesNumber} placeholder="TN 09 AZ XXXX" onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                 </label>
//                                             </div>
//                                             <div>
//                                                 <label> Slot Count:
//                                                     <input type="text" name="SlotCount" value={formData.SlotCount} onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                 </label>
//                                             </div>

//                                             <div>
//                                                 <div>
//                                                     <label> Based On:
//                                                         <select name="Based" value={formData.Based} onChange={handleChange} className="ml-2 p-1 border rounded">
//                                                             <option value="">Select</option>
//                                                             <option value="Hourly">Hourly</option>
//                                                             <option value="daily">Daily</option>
//                                                             <option value="Monthly">Monthly</option>
//                                                         </select>
//                                                     </label>
//                                                 </div>
//                                                 <br />
//                                                 {formData.Based === "Hourly" && (
//                                                     <div>
//                                                         <div>
//                                                             <label> Start Time:
//                                                                 <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                             </label>
//                                                         </div>
//                                                         <br />
//                                                         <div>
//                                                             <label> End Time:
//                                                                 <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                                 <br />
//                                                 {(formData.Based === "daily" || formData.Based === "Monthly") && (
//                                                     <div>
//                                                         <div>
//                                                             <label> Start Time:
//                                                                 <input type="date" name="startTime" value={formData.startTime} onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                             </label>
//                                                         </div>
//                                                         <br />
//                                                         <div>
//                                                             <label> End Time:
//                                                                 <input type="date" name="endTime" value={formData.endTime} onChange={handleChange} className="ml-2 p-1 border rounded" />
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <label> Amount:
//                                                     <input type="text" name="Amount" value={formData.Amount} className="ml-2 p-1 border rounded" />
//                                                 </label>

//                                             </div>
//                                             <input type="submit" value="Book Now" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer" />
//                                         </form>
//                                     </div>
//                                 )}
//                             </div>
//                             {showPricing === index && (
//                                 <div className="mt-3 bg-gray-100 p-3 rounded text-sm">
//                                     <p><span className="font-semibold">Hourly:</span> {ele?.pricing?.hourly}</p>
//                                     <p><span className="font-semibold">Daily:</span> {ele?.pricing?.daily}</p>
//                                     <p><span className="font-semibold">Monthly:</span> {ele?.pricing?.monthly}</p>
//                                 </div>
//                             )}
//                             {showDetails === index && (
//                                 <div className="mt-3 bg-gray-100 p-3 rounded text-sm">
//                                     <strong className="block mb-1">Facilities:</strong>
//                                     <ul className="list-disc list-inside mb-2">
//                                         {ele.facilities.map((item, i) => (
//                                             <li key={i}>{item}</li>
//                                         ))}
//                                     </ul>

//                                     <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
//                                         onClick={() => setShowImages(showImages === index ? null : index)} >Show Images </button>

//                                     {showImages === index && (
//                                         <div className="flex gap-2 overflow-x-auto mt-3">
//                                             {ele.parkingImages.map((img, i) => (
//                                                 <img
//                                                     key={i}
//                                                     src={img}
//                                                     alt={`parking-${i}`}
//                                                     className="w-40 h-30 object-cover rounded flex-shrink-0"
//                                                 />
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                             <div className="mt-3">
//                                 {showMap === index && (
//                                     <div className="bg-gray-100 p-3 rounded">
//                                         <div className="w-full h-[500px]">
//                                             <MyMap
//                                                 location={{
//                                                     lat: ele.location?.geo?.lat,
//                                                     lng: ele.location?.geo?.lng
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                     <div className="flex justify-center items-center gap-6 mt-12">

//                         {/* Prev */}
//                         <button
//                             disabled={currentPage === 1}
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 
//                shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             ← Prev
//                         </button>

//                         {/* Current Page */}
//                         <div className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-900 text-white shadow-md">
//                             <span className="text-sm text-gray-300">Page</span>
//                             <span className="text-lg font-bold">{currentPage}</span>
//                             <span className="text-sm text-gray-400">/ {totalPages || 1}</span>
//                         </div>

//                         {/* Next */}
//                         <button
//                             disabled={currentPage === totalPages || totalPages === 0}
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 
//                shadow-sm hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
//                         >
//                             Next →
//                         </button>

//                     </div>

//                 </div>
//             ) : (
//                 <div className="flex justify-center items-center h-40">
//                     <p className="text-red-500 text-lg bg-white px-6 py-4 rounded-xl shadow">
//                         Slot Data Aren't Shown..
//                     </p>
//                 </div>
//             )}



//         </div>
//     );
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FetchSlots } from "../../slices/parkingSlot.jsx";
import { fetchBookings } from "../../slices/BookingSlices.jsx";
import MyMap from "../../config/mapComponent.jsx";
import Pagination from "../../config/pagination.jsx";

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
    const [showBooking, setShowBooking] = useState(null);

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 24 }));
        dispatch(fetchBookings({ page, limit: 24 }));
    };

    useEffect(() => {
        handlePageChange(1);
    }, []);




    return (
        <div className="min-h-screen bg-yellow-100 p-4">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate("/AllUserInMap")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Find Slots
                </button>
            </div>

            {SlotInfo.length !== 0 ? (
                <div className="grid gap-6">
                    {SlotInfo.map((ele, index) => (
                        <div key={ele._id} className="bg-blue-200 rounded-xl shadow-md p-4">
                            <div className="space-y-1">
                                <p><strong>Slot Name:</strong> {ele?.name}</p>
                                <p><strong>Address:</strong> {ele?.address}</p>
                                <p><strong>Vehicles:</strong> {ele?.vehicles}</p>
                                <p><strong>Available:</strong> {getAvailableSlots(ele._id, ele.totalSlot)}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <button onClick={() => setPricing(showPricing === index ? null : index)} className="px-3 py-1 bg-blue-500 text-white rounded">Pricing</button>
                                <button onClick={() => setShowMap(showMap === index ? null : index)} className="px-3 py-1 bg-green-500 text-white rounded">Map</button>
                                <button onClick={() => setDetails(showDetails === index ? null : index)} className="px-3 py-1 bg-purple-500 text-white rounded">Details</button>
                                <button className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                                    onClick={() => navigate("/slotbookingpage", { state: ele })}>  Book </button>
                            </div>

                            {showPricing === index && (
                                <div className="bg-gray-100 p-3 mt-3 rounded">
                                    <p>Hourly: {ele?.pricing?.hourly}</p>
                                    <p>Daily: {ele?.pricing?.daily}</p>
                                    <p>Monthly: {ele?.pricing?.monthly}</p>
                                </div>
                            )}

                            {showDetails === index && (
                                <div className="bg-gray-100 p-3 mt-3 rounded">
                                    <ul>
                                        {ele.facilities.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>

                                    <button onClick={() => setShowImages(showImages === index ? null : index)}>
                                        Show Images
                                    </button>

                                    {showImages === index && (
                                        <div className="flex gap-2 mt-2">
                                            {ele.parkingImages.map((img, i) => (
                                                <img key={i} src={img} className="w-32 h-24 rounded" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {showMap === index && (
                                <div className="mt-3 h-[400px]">
                                    <MyMap
                                        location={{
                                            lat: ele.location?.geo?.lat,
                                            lng: ele.location?.geo?.lng
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    

                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />    
                </div>
            ) : (
                <div className="text-center text-red-500">
                    Slot Data Aren't Shown..
                </div>
            )}
        </div>
    );
}