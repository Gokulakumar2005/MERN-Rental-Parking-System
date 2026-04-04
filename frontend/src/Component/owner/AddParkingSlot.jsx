
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddSlot } from "../../slices/parkingSlot";
import { useLocation } from "react-router-dom";

import { fetchBookings } from "../../slices/BookingSlices.jsx";
import { updateSlot } from "../../slices/parkingSlot";


export default function AddParkingSlot() {
    const userDetails = useSelector((state) => {
        return state.auth
    })

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const Data = location.state;
    console.log({ "inside add Slot ,data is coming from the own Slot ": Data })

    const [Error, setError] = useState({})
    const [form, setForm] = useState({
        name: "",
        address: "",
        vehicles: "",
        totalSlot: "",
        pricing: {
            hourly: "",
            daily: '',
            monthly: ''
        },
        facilities: [],
        parkingImages: [],
        propertyDocument: {
            documentType: "",
            proof: []
        }
    })
    useEffect(() => {
        if (Data) {
            setForm({
                name: Data.name || "",
                address: Data.address || "",
                vehicles: Data.vehicles || "",
                totalSlot: Data.totalSlot || "",
                pricing: {
                    hourly: Data.pricing?.hourly || "",
                    daily: Data.pricing?.daily || "",
                    monthly: Data.pricing?.monthly || ""
                },
                facilities: Data.facilities || [],
                parkingImages: [],
                propertyDocument: {
                    documentType: Data.propertyDocument?.documentType || "",
                    proof: []
                }
            })
        }
    }, [Data])
    const handlePropertyChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            propertyDocument: {
                ...form.propertyDocument,
                [name]: value
            }
        })
    }

    const handlePricingChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            pricing: {
                ...form.pricing,
                [name]: value
            }
        });
    };

    const handlePropertyProof = (e) => {
        setForm({
            ...form,
            propertyDocument: {
                ...form.propertyDocument,
                proof: [...e.target.files]
            }
        })
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = {};
        if (form.name.trim().length === 0) {
            error.name = "Name is Required *"
        }
        if (form.address.trim().length === 0) {
            error.address = "Address is Required *"
        }
        if (form.vehicles.trim().length === 0) {
            error.vehicles = "vehicles is Required *"
        }
        if (form.totalSlot.trim().length === 0) {
            error.totalSlot = "Total Slot is Required *"
        }
        if (form.pricing.hourly.trim().length === 0) {
            error.hourly = "Hour's is Required *"
        }
        if (form.pricing.daily.trim().length === 0) {
            error.daily = "Daily is Required *"
        }
        if (form.pricing.monthly.trim().length === 0) {
            error.monthly = "Monthly is Required *"
        }
        if (form.facilities.length === 0) {
            error.facilities = "Facilities is Required *"
        }
        if (form.parkingImages.length === 0 && !Data) {
            error.parkingImages = "Parking Images is Required *"
        }
        if (form.propertyDocument.proof.length === 0 && !Data) {
            error.proof = " Document Proof  is Required *"
        }
        if (form.propertyDocument.documentType.length === 0) {
            error.documentType = "Document Type is Required *"
        }
        if (Object.keys(error).length !== 0) {
            setError(error);
            return;
        }
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("address", form.address);
        formData.append("vehicles", form.vehicles);
        formData.append("totalSlot", form.totalSlot);
        formData.append("vendorId", userDetails.user._id);
        formData.append("pricing", JSON.stringify(form.pricing));
        formData.append("facilities", JSON.stringify(form.facilities));
        formData.append("propertyDocument", JSON.stringify({ documentType: form.propertyDocument.documentType, }));
        form.parkingImages.forEach((file) => {
            formData.append("parkingImages", file);
        });
        form.propertyDocument.proof.forEach((file) => {
            formData.append("proof", file);
        });
        console.log("Form Data:", formData);
        
        if (!Data) {
            dispatch(AddSlot({ form: formData }))
                .then(() => navigate("/myslots"));
        } else {
            formData.append("slotId", Data._id);
            dispatch(updateSlot({ formData }))
                .then(() => navigate("/myslots"));
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex items-center justify-center p-6">

            <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
                <div><button onClick={() => {
                    navigate(-1);
                }}>BACK</button></div>
                {Data ? (
                    <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
                        Add Parking Slot
                    </h2>
                ) : (
                    <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">Update Slot </h2>
                )}


                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            placeholder="Enter the Name"
                            name="name"
                            onChange={handleChange}
                            onBlur={() => {
                                if (form.name.trim().length === 0) {
                                    setError({ ...Error, name: "Name is Required *" })
                                }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        {Error.name && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.name}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Address</label>
                        <input
                            type="text"
                            value={form.address}
                            placeholder="Enter the Address"
                            name="address"
                            onChange={handleChange}
                            onBlur={() => {
                                if (form.address.trim().length === 0) {
                                    setError({ ...Error, address: "Address is Required *" })
                                }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        {Error.address && (
                            <span className="text-red-500 text-sm block mt-1 text-left">
                                {Error.address}
                            </span>
                        )}
                    </div>


                    <div>
                        <div>
                            <label>Bike <input type="radio" value="bike" name="vehicles" onChange={handleChange} checked={form.vehicles === 'bike'} /> </label>
                            <label>Car <input type="radio" value="car" name="vehicles" onChange={handleChange} checked={form.vehicles === 'car'} /> </label>
                            {Error.vehicles && (
                                <span className="text-red-500 text-sm block mt-1 text-left">
                                    {Error.vehicles}
                                </span>
                            )}
                        </div>

                        {(form.vehicles == "bike" || form.vehicles == "car") &&
                            <>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Total Slots</label>
                                    <input
                                        type="text"
                                        value={form.totalSlot}
                                        placeholder="Enter the slot Count"
                                        name="totalSlot"
                                        onChange={handleChange}
                                        onBlur={() => {
                                            if (form.totalSlot.trim().length === 0) {
                                                setError({ ...Error, totalSlot: "Slot is Required *" })
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                                    />
                                    {Error.totalSlot && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.totalSlot}
                                        </span>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">Pricing</label>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <div>
                                            <label className="text-sm text-gray-600">Per Hour</label>
                                            <input
                                                type="text"
                                                value={form.pricing.hourly}
                                                name="hourly"
                                                onChange={handlePricingChange}
                                                onBlur={() => {
                                                    if (form.pricing.hourly.trim().length === 0) {
                                                        setError({ ...Error, hourly: "Hour's is Required *" })
                                                    }
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                            />
                                            {Error.hourly && (
                                                <span className="text-red-500 text-sm block mt-1 text-left">
                                                    {Error.hourly}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-600">Daily</label>
                                            <input
                                                type="text"
                                                value={form.pricing.daily}
                                                name="daily"
                                                onChange={handlePricingChange}
                                                onBlur={() => {
                                                    if (form.pricing.daily.trim().length === 0) {
                                                        setError({ ...Error, daily: "Daily is Required *" })
                                                    }
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                            />
                                            {Error.daily && (
                                                <span className="text-red-500 text-sm block mt-1 text-left">
                                                    {Error.daily}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-600">Monthly</label>
                                            <input
                                                type="text"
                                                value={form.pricing.monthly}
                                                name="monthly"
                                                onChange={handlePricingChange}
                                                onBlur={() => {
                                                    if (form.pricing.monthly.trim().length === 0) {
                                                        setError({ ...Error, monthly: "Monthly is Required *" })
                                                    }
                                                }}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
                                            />
                                            {Error.monthly && (
                                                <span className="text-red-500 text-sm block mt-1 text-left">
                                                    {Error.monthly}
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </div>


                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Facilities</label>
                                    <input
                                        type="text"
                                        value={form.facilities.join(",")}
                                        name="facilities"
                                        placeholder="CCTV, Security, EV Charging..."
                                        // onChange={(e) => {
                                        //     setForm({ ...form, [e.target.name]: e.target.value.split(",") })
                                        // }}
                                        onChange={(e) => {
                                            const value = e.target.value
                                                .split(",")
                                                .map(item => item.trim())
                                                .filter(Boolean);

                                            setForm({ ...form, facilities: value });
                                        }}
                                        onBlur={() => {
                                            if (form.facilities.length === 0) {
                                                setError({ ...Error, facilities: "Facilities is Required *" })
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                                    />
                                    {Error.facilities && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.facilities}
                                        </span>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Slot Images</label>
                                    <input
                                        type="file"
                                        name="parkingImages"
                                        multiple
                                        onChange={(e) =>
                                            setForm({ ...form, parkingImages: [...e.target.files] })
                                        }
                                        onBlur={() => {
                                            if (form.parkingImages.length === 0 && !Data) {
                                                setError({ ...Error, parkingImages: "Parking Images is Required *" })
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                                    />
                                    {Error.parkingImages && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.parkingImages}
                                        </span>
                                    )}
                                </div>


                                <div className="border-t pt-6">

                                    <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                                        Property Details
                                    </h3>

                                    <select
                                        value={form.propertyDocument.documentType}
                                        name="documentType"
                                        onChange={handlePropertyChange}
                                        onBlur={() => {
                                            if (form.propertyDocument.documentType.trim().length === 0) {
                                                setError({ ...Error, documentType: "Document Type is Required *" })
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-indigo-400"
                                    >
                                        <option value="">Select Document Type</option>
                                        <option value="registration-document">Registration Document</option>
                                        <option value="rental-document">Rental Document</option>

                                    </select>
                                    {Error.documentType && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.documentType}
                                        </span>
                                    )}
                                    <input
                                        type="file"
                                        name="proof"
                                        multiple
                                        onChange={handlePropertyProof}
                                        onBlur={() => {
                                            if (form.propertyDocument.proof.length === 0 && !Data) {
                                                setError({ ...Error, proof: "Proof is Required *" })
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                                    />
                                    {Error.proof && (
                                        <span className="text-red-500 text-sm block mt-1 text-left">
                                            {Error.proof}
                                        </span>
                                    )}

                                </div>


                                <div className="pt-4">
                                    <input
                                        type="submit"
                                        value={Data ? "Update Slot" : "Add Slot"}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
                                    />
                                </div>

                            </>

                        }
                    </div>
                </form>

            </div>
        </div>
    )
}