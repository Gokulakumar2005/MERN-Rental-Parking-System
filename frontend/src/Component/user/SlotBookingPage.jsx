
import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../../slices/BookingSlices.jsx";
import { resetPaymentState } from "../../slices/BookingSlices.jsx";
import { data, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBookings } from "../../slices/BookingSlices.jsx";



export default function SlotBookingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const Data = location.state;
    console.log({ "Data in Slot Booking Page": Data });
    const userId = useSelector((state) => state.auth.user._id);
    const { myBooking } = useSelector((state) => state.booking);
    console.log({ "mybooking inside slot booking page": myBooking });

    // const bookedSlots = myBooking.flatMap(ele => ele.slotcount);
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
                        navigate("/mybookings"); // optional redirect
                    } else {
                        alert("❌ Payment verification failed");
                    }
                },

                prefill: {
                    name: "User",
                    email: "user@email.com"
                },

                theme: {
                    color: "#3399cc"
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
            <div>
                <center>
                    <p className="p-6 text-red-500">No slot selected</p>;
                </center>
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
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                <div>
                    <button
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 border">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3"> Slot Details </h2>

                    <p className="text-gray-700">
                        <span className="font-medium">Slot Name:</span> {Data.name}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Address:</span> {Data.address}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Available Slots:</span> {getAvailableSlots(Data._id, Data.totalSlot)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 border">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Book Your Parking Slot
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <p className="font-medium mb-2 text-gray-700"> Select Vehicle Type: </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, vehicletype: "Car" })
                                    }
                                    className={`px-4 py-2 rounded-lg border transition
                                ${formData.vehicletype === "Car"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    onBlur={() => {
                                        if (formData.vehicletype.trim().length === 0) {
                                            setError({ ...Error, vehicletype: "vehicle Type is Required *" })
                                        }
                                    }}
                                >
                                    Car
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, vehicletype: "Bike" })
                                    }
                                    className={`px-4 py-2 rounded-lg border transition
                                ${formData.vehicletype === "Bike"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 hover:bg-gray-300"
                                        }`}
                                    onBlur={() => {
                                        if (formData.vehicletype.trim().length === 0) {
                                            setError({ ...Error, vehicletype: "vehicle Type is Required *" })
                                        }
                                    }}
                                >
                                    Bike
                                </button>
                                {Error.vehicletype && (
                                    <span className="text-red-500 text-sm block mt-1 text-left">
                                        {Error.vehicletype}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1"> Vehicle Number </label>
                            <input
                                type="text"
                                name="vehiclesNumber"
                                value={formData.vehiclesNumber}
                                placeholder="TN YY AB XXXX"
                                onChange={handleChange}
                                onBlur={() => {
                                    if (formData.vehiclesNumber.trim().length === 0) {
                                        setError({ ...Error, vehiclesNumber: "vehicle Number is Required *" })
                                    }
                                }}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {Error.vehiclesNumber && (
                                <span className="text-red-500 text-sm block mt-1 text-left">
                                    {Error.vehiclesNumber}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-medium mb-2 text-gray-700">Select Slots:</p>
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

                                                setFormData({
                                                    ...formData,
                                                    slotcount: updatedSlots,
                                                });
                                            }}
                                            className={`px-3 py-2 rounded-lg border transition
                ${isBooked ?
                                                    "bg-red-400 text-white cursor-not-allowed"
                                                    : isSelected ? "bg-green-500 text-white"
                                                        : "bg-gray-100 hover:bg-gray-200"}`}>
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                            {Error.slotcount && (
                                <span className="text-red-500 text-sm block mt-1 text-left">
                                    {Error.slotcount}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1"> Based On </label>

                            <select name="Based" value={formData.Based} onChange={handleChange}
                                onBlur={() => {
                                    if (formData.Based.trim().length === 0) {
                                        setError({ ...Error, Based: "Based on is Required *" })
                                    }
                                }}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" >
                                <option value="">Select</option>
                                <option value="Hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            {Error.Based && (
                                <span className="text-red-500 text-sm block mt-1 text-left">
                                    {Error.Based}
                                </span>
                            )}
                        </div>
                        {formData.Based === "Hourly" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1"> Start Time </label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (formData.startTime.trim().length === 0) {
                                                setError({ ...Error, startTime: "start Time is Required *" })
                                            }
                                        }}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    {Error.startTime && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.startTime}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">  End Time </label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (formData.endTime.trim().length === 0) {
                                                setError({ ...Error, endTime: "End Time is Required *" })
                                            }
                                        }}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    {Error.endTime && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.endTime}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        {(formData.Based === "daily" || formData.Based === "Monthly") && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (formData.startTime.trim().length === 0) {
                                                setError({ ...Error, startTime: "Start Date is Required *" })
                                            }
                                        }}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    {Error.startTime && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.startTime}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (formData.endTime.trim().length === 0) {
                                                setError({ ...Error, endTime: "end Date is Required *" })
                                            }
                                        }}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    {Error.endTime && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.endTime}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1"> Amount </label>
                            <input type="text" name="Amount" value={calculateAmount() || ""} readOnly
                                className="w-full p-2 border rounded-lg bg-gray-100" />

                        </div>
                        <div>
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium" > Book Now  </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

