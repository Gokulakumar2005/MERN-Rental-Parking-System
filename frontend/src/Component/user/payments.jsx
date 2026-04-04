
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../config/axiosInstance";
import { fetchBookings } from "../../slices/BookingSlices";
import { useDispatch } from "react-redux";
export default function Payments() {
    const [payment, setpayment] = useState([]);
    const dispatch = useDispatch();
    const { myBooking } = useSelector((state) => state.booking);
   
    // console.log({ "common": common });

    useEffect(() => {
        const fetchPayment = async (req, res) => {
            try {
                const response = await axios.get("/user/fetch/payments", { headers: { Authorization: localStorage.getItem("token") } });
                const data = response.data;
                // console.log(data);
                setpayment(data);
            } catch (error) {
                console.log(error.response.data);
            }
        }
        fetchPayment();
        dispatch(fetchBookings());

    }, [dispatch]);

    // console.log({ "payment data": payment });
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6"> Payment History  </h1>

                {payment.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...payment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, i) => {

                            const matchedBooking = myBooking.find(
                                (b) => b.paymentId === ele.paymentId
                            );
                            return (
                                <div key={i} className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold text-gray-700">  Booking #{i + 1}  </h2>
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium   ${matchedBooking?.status === "Booked" ?
                                            "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"}`}  >{matchedBooking?.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-gray-600 text-sm">
                                        <p><span className="font-medium text-gray-800">  Booked Slot Count: </span> {ele.slotcount}</p>
                                        <p><span className="font-medium text-gray-800">  Amount Paid: </span>  ₹{ele.amount} </p>
                                        <p><span className="font-medium text-gray-800"> Payment Status:  </span> {ele.PaymentStatus}  </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow">
                        No payment records found.
                    </div>
                )}
            </div>
        </div>
    );


}