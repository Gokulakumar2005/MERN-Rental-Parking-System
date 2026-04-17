import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../../slices/BookingSlices.jsx";
import { resetPaymentState } from "../../slices/BookingSlices.jsx";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBookings } from "../../slices/BookingSlices.jsx";
import { ArrowLeft, MapPin, Car, CreditCard, Hash, Clock, CalendarDays, AlertCircle, AlertTriangle, RefreshCcw } from "lucide-react";


export default function SlotBookingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const Data = location.state;
    console.log({ "Data in Slot Booking Page": Data });
    const userId = useSelector((state) => state.auth.user._id);
    const { myBooking, error: reduxError } = useSelector((state) => state.booking);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);

    console.log({ "mybooking inside slot booking page": myBooking });

    const bookedSlots = myBooking
        .filter(b => b.slotId === Data._id && b.status === "Booked")
        .flatMap(b => b.BookedSlots);
    console.log({ "booked slots": bookedSlots });

    const getAvailableSlots = (slotId, totalSlots) => {
        const bookedCount = myBooking
            .filter(b => b.slotId === slotId && b.status === "Booked")
            .reduce((acc, b) => acc + b.BookedSlots?.length, 0);

        return totalSlots - bookedCount;
    };

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const [Error, setError] = useState({});

    const [formData, setFormData] = useState({
        vehicletype: "",
        vehiclesNumber: "",
        slotcount: [],
        Amount: "",
        Based: "",
        startTime: "",
        endTime: "",
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amount = calculateAmount();

        const error = {};

        if (formData.vehicletype.trim().length === 0) {
            error.vehicletype = "Vehicle Type is Required *"
        }
        if (formData.vehiclesNumber.trim().length === 0) {
            error.vehiclesNumber = "Vehicle Number is Required *"
        }

        if (formData.slotcount.length === 0) {
            error.slotcount = "Slot  is required *"
        }
        if (formData.Based.trim().length === 0) {
            error.Based = "Based On is Required *"
        }
        if (formData.startTime.trim().length === 0) {
            error.startTime = "Start Time  is Required *"
        }
        if (formData.endTime.trim().length === 0) {
            error.endTime = "End Time  is Required *"
        }
        if (Object.keys(error).length !== 0) {
            setError(error);
            return;
        }

        if (formData.slotcount.length === 0) {
            alert("Please select at least one slot");
            return;
        }

        if (formData.slotcount.length > Data.totalSlot) {
            alert("Not enough slots available");
            return;
        }
        if (!amount) {
            return alert("Invalid amount");
        }
        const availableSlotsCount = getAvailableSlots(Data._id, Data.totalSlot);
        if (formData.slotcount.length > availableSlotsCount) {
            alert("Not enough slots available");
            return;
        }
        const finalData = {
            ...formData,
            Amount: amount,
            userId,
            slotId: Data._id,
            vendorId: Data.vendorId
        };
        console.log("FINAL DATA:", finalData);

        try {
            const result = await dispatch(createOrder(Number(amount)));

            if (result.meta.requestStatus !== "fulfilled") {
                return alert("Order creation failed");
            }

            const order = result.payload;

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded");
                return;
            }

            const options = {
                key: "rzp_test_SZjnQX6aTQwSjC",
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,

                name: "Parking Booking",
                description: "Slot Booking Payment",

                handler: async function (response) {
                    const verifyRes = await dispatch(verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        bookingData: finalData
                    }));

                    if (verifyRes.meta.requestStatus === "fulfilled") {
                        alert("✅ Booking Confirmed!");
                        dispatch(resetPaymentState());
                        navigate("/mybookings");
                    } else {
                        alert("❌ Payment verification failed");
                    }
                },

                prefill: {
                    name: "User",
                    email: "user@email.com"
                },

                theme: {
                    color: "#6366f1"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    if (!Data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                    <AlertCircle size={48} className="text-slate-300 mb-4" />
                    <p className="text-xl font-bold text-slate-800 mb-6">No slot selected</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            </div>
        )
    }

    const calculateAmount = () => {
        if (!formData.startTime || !formData.endTime || formData.slotcount.length === 0)
            return "";

        const slotcount = formData.slotcount.length;

        const diff = new Date(formData.endTime) - new Date(formData.startTime);
        if (diff <= 0) return "";

        if (formData.Based === "Hourly") {
            const hours = Math.ceil(diff / (1000 * 60 * 60));
            return slotcount * hours * (Data?.pricing?.hourly || 0);
        }

        if (formData.Based === "daily") {
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            return slotcount * days * (Data?.pricing?.daily || 0);
        }

        if (formData.Based === "Monthly") {
            const months = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
            return slotcount * months * (Data?.pricing?.monthly || 0);
        }

        return "";
    };

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition placeholder-slate-400";
    const errorClass = "text-rose-500 text-sm font-semibold mt-1.5 flex items-center gap-1";

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-6">
                <button
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl hover:bg-white transition shadow-sm border border-transparent hover:border-slate-200 cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} /> Back to Slots
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                    <h2 className="text-xl font-extrabold text-slate-800 mb-5 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><MapPin size={20} /></div>
                        Slot Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Slot Name</p>
                            <p className="font-extrabold text-slate-800">{Data.name}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                            <p className="font-bold text-slate-700 text-sm">{Data.address}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Available Slots</p>
                            <p className="text-2xl font-extrabold text-emerald-600">{getAvailableSlots(Data._id, Data.totalSlot)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
                    <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><CreditCard size={20} /></div>
                        Book Your Parking Slot
                    </h2>

                    {serverError && (
                        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                    <AlertTriangle size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Booking Alert</h3>
                                    <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "There was an issue processing your booking request."}</p>
                                </div>
                            </div>
                            <button onClick={() => setServerError(null)} className="p-2.5 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors">
                                <RefreshCcw size={18} />
                            </button>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Car size={16} /> Select Vehicle Type</p>
                            <div className="flex gap-3">
                                {["Car", "Bike"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, vehicletype: type })}
                                        onBlur={() => { if (formData.vehicletype.trim().length === 0) setError({ ...Error, vehicletype: "Vehicle Type is Required *" }) }}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${formData.vehicletype === type ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            {Error.vehicletype && <p className={errorClass}><AlertCircle size={14} />{Error.vehicletype}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Number</label>
                            <input
                                type="text"
                                name="vehiclesNumber"
                                value={formData.vehiclesNumber}
                                placeholder="TN YY AB XXXX"
                                onChange={handleChange}
                                onBlur={() => { if (formData.vehiclesNumber.trim().length === 0) setError({ ...Error, vehiclesNumber: "Vehicle Number is Required *" }) }}
                                className={inputClass}
                            />
                            {Error.vehiclesNumber && <p className={errorClass}><AlertCircle size={14} />{Error.vehiclesNumber}</p>}
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Hash size={16} /> Select Slots</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.from({ length: Data.totalSlot }, (_, i) => {
                                    const value = i + 1;
                                    const isBooked = bookedSlots.includes(value);
                                    const isSelected = formData.slotcount.includes(value);

                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={isBooked}
                                            onClick={() => {
                                                if (isBooked) return;
                                                let updatedSlots;
                                                if (isSelected) {
                                                    updatedSlots = formData.slotcount.filter(ele => ele !== value);
                                                } else {
                                                    updatedSlots = [...formData.slotcount, value];
                                                }
                                                setFormData({ ...formData, slotcount: updatedSlots });
                                            }}
                                            className={`w-11 h-11 rounded-xl font-extrabold text-sm transition border cursor-pointer ${
                                                isBooked
                                                    ? "bg-rose-100 text-rose-400 border-rose-200 cursor-not-allowed"
                                                    : isSelected
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                    : "bg-slate-50 text-slate-60 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-500">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span> Selected</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-100 border border-rose-200 inline-block"></span> Booked</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block"></span> Available</span>
                            </div>
                            {Error.slotcount && <p className={errorClass}><AlertCircle size={14} />{Error.slotcount}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16} /> Based On</label>
                            <select
                                name="Based"
                                value={formData.Based}
                                onChange={handleChange}
                                onBlur={() => { if (formData.Based.trim().length === 0) setError({ ...Error, Based: "Based on is Required *" }) }}
                                className={inputClass}
                            >
                                <option value="">Select pricing type</option>
                                <option value="Hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            {Error.Based && <p className={errorClass}><AlertCircle size={14} />{Error.Based}</p>}
                        </div>

                        {formData.Based === "Hourly" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><CalendarDays size={16} /> Start Time</label>
                                    <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange}
                                        onBlur={() => { if (formData.startTime.trim().length === 0) setError({ ...Error, startTime: "Start Time is Required *" }) }}
                                        className={inputClass} />
                                    {Error.startTime && <p className={errorClass}><AlertCircle size={14} />{Error.startTime}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><CalendarDays size={16} /> End Time</label>
                                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange}
                                        onBlur={() => { if (formData.endTime.trim().length === 0) setError({ ...Error, endTime: "End Time is Required *" }) }}
                                        className={inputClass} />
                                    {Error.endTime && <p className={errorClass}><AlertCircle size={14} />{Error.endTime}</p>}
                                </div>
                            </div>
                        )}

                        {(formData.Based === "daily" || formData.Based === "Monthly") && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                                    <input type="date" name="startTime" value={formData.startTime} onChange={handleChange}
                                        onBlur={() => { if (formData.startTime.trim().length === 0) setError({ ...Error, startTime: "Start Date is Required *" }) }}
                                        className={inputClass} />
                                    {Error.startTime && <p className={errorClass}><AlertCircle size={14} />{Error.startTime}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                                    <input type="date" name="endTime" value={formData.endTime} onChange={handleChange}
                                        onBlur={() => { if (formData.endTime.trim().length === 0) setError({ ...Error, endTime: "End Date is Required *" }) }}
                                        className={inputClass} />
                                    {Error.endTime && <p className={errorClass}><AlertCircle size={14} />{Error.endTime}</p>}
                                </div>
                            </div>
                        )}

                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Amount</p>
                                <p className="text-3xl font-extrabold text-indigo-700">
                                    {calculateAmount() ? `₹${calculateAmount()}` : "—"}
                                </p>
                            </div>
                            {calculateAmount() && (
                                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                                    <CreditCard size={28} />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-lg tracking-tight flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <CreditCard size={20} /> Pay & Book Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
