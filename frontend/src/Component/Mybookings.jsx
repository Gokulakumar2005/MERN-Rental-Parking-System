

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../slices/BookingSlices";
import { useNavigate } from "react-router-dom";



export default function Mybookings() {


    const { myBooking } = useSelector((state) => state.booking);

    const { user } = useSelector((state) => state.auth);



    // console.log({ "booking Inside Mybooking Component": myBooking });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const CommonId_Bookings = myBooking.filter((ele) => (ele.userId === user._id || ele.vendorId === user._id));
    console.log({ "common_id_bookings": CommonId_Bookings });


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    My Bookings
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Here you can view all your parking slot bookings.
                </p>

                <div className="space-y-4">
                    {CommonId_Bookings.length === 0 ? (
                        <p className="text-center text-gray-500 font-medium">
                            🚫 No bookings found. Start booking a slot!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {[...CommonId_Bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, index) => {
                                return (
                                    <div key={index} className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition" >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                                            <h4 className="font-medium"> Vehicle Type:<span className="ml-2 font-normal">{ele.vehicletype}</span> </h4>
                                            <h4 className="font-medium">Vehicle Number: <span className="ml-2 font-normal">{ele.vehiclesNumber}</span> </h4>
                                            <h4 className="font-medium">  Amount: <span className="ml-2 font-normal text-green-600">{ele.Amount}</span> </h4>
                                            <h4 className="font-medium">  Slot Status:<span className="ml-2 font-normal text-blue-600">{ele.status}</span> </h4>
                                            <h4 className="font-medium">Start Time: <span className="ml-2 font-normal"> {new Date(ele.startTime).toLocaleString()} </span> </h4>
                                            <h4 className="font-medium"> End Time:<span className="ml-2 font-normal">{new Date(ele.endTime).toLocaleString()}</span></h4>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            {ele.status === "Booked" && (
                                                <button
                                                    onClick={() => navigate("/chatPage", { state: ele })}
                                                    className="bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
                                                >
                                                    💬
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                        </div>

                                    </div>
                                );

                            })}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}


// Amount
// :
// 40
// Based
// :
// "Hourly"
// SlotCount
// :
// 1
// createdAt
// :
// "2026-03-30T10:39:29.770Z"
// endTime
// :
// "2026-03-31T17:37:00.000Z"
// slotId
// :
// "69c7a43c0cca22fc650e13bc"
// startTime
// :
// "2026-03-31T14:30:00.000Z"
// status
// :
// "completed"
// updatedAt
// :
// "2026-03-30T10:39:29.770Z"
// userId
// :
// "69c75c6afd7691eb8580b499"
// vehiclesNumber
// :
// "TN 09 AZ 5902"
// vehicletype
// :
// "Bike"
// __v
// :
// 0
// _id
// :
// "69ca52e163898605df66d3df"