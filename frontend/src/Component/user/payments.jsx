import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../config/axiosInstance";
import { fetchBookings } from "../../slices/BookingSlices";
import Pagination from "../../config/pagination.jsx";
import { useDispatch } from "react-redux";
import { CreditCard, Calendar, CheckCircle2, Clock, IndianRupee } from "lucide-react";

export default function Payments() {
    const [payment, setpayment] = useState([]);
    const [pagination, setPagination] = useState({});
    const dispatch = useDispatch();
    const { myBooking } = useSelector((state) => state.booking);

    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};
    const handlePageChange = (page) => {
        // Assuming FetchSlots was a placeholder or intended to be fetchPayment
        fetchPayment(page);
    };

    const fetchPayment = async (page = 1) => {
        try {
            const response = await axios.get("/user/fetch/payments", { headers: { Authorization: localStorage.getItem("token") }, params: { page, limit: 24 } });
            const data = response.data;
            setpayment(data);
            setPagination(response.data?.pagination || {});
        } catch (error) {
            console.log(error.response?.data);
        }
    }

    useEffect(() => {
        fetchPayment(1);
        dispatch(fetchBookings({ page: 1, limit: 24 }));
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
                    <p className="text-slate-500 mt-1">Manage and view your transaction records</p>
                </div>

                {payment.length > 0 ? (
                    <div className="space-y-4">
                        {[...payment].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((ele, i) => {
                            const matchedBooking = myBooking.find((b) => b.paymentId === ele.paymentId);
                            const isSuccess = ele.PaymentStatus === "Success" || matchedBooking?.status === "Booked";

                            return (
                                <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Transaction #{ele.paymentId?.slice(-8) || i + 1}</h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <Calendar size={14} />
                                                <span>{new Date(ele.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-slate-500">Amount</p>
                                            <p className="font-bold text-slate-900 flex items-center justify-end">
                                                <IndianRupee size={14} />{ele.amount}
                                            </p>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                            {isSuccess ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {ele.PaymentStatus}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="mt-8">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="text-slate-400 mb-2">No payment records found</div>
                        <p className="text-sm text-slate-500">Your transaction history will appear here once you make a booking.</p>
                    </div>
                )}
            </div>
        </div>
    );
}