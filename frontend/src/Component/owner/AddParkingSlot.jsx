import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { AddSlot, updateSlot } from "../../slices/parkingSlot";
import { ArrowLeft, MapPin, Car, LayoutGrid, IndianRupee, Shield, Image, FileText, AlertCircle, ParkingCircle, AlertTriangle, RefreshCcw,Loader2 } from "lucide-react";


export default function AddParkingSlot() {
    const { user: user, Error: reduxAuthError } = useSelector((state) => state.auth);
    const { error: reduxSlotError,loading } = useSelector((state) => state.slot);
    const [serverError, setServerError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const Data = location.state;
    // console.log({ "inside add Slot ,data is coming from the own Slot ": Data })

    useEffect(() => {
        if (reduxAuthError || reduxSlotError) {
            setServerError(reduxAuthError || reduxSlotError);
        }
    }, [reduxAuthError, reduxSlotError]);


    const [Error, setError] = useState({})
    const [form, setForm] = useState({
        name: "",
        address: "",
        Area: "",
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
                Area: Data.Area || "",
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
        if (form.Area.trim().length === 0) {
            error.Area = "Area is Required *"
        }
        if (form.vehicles.trim().length === 0) {
            error.vehicles = "vehicles is Required *"
        }
        if (form.totalSlot.length === 0) {
            error.totalSlot = "Total Slot is Required *"
        }
        if (form.pricing.hourly.toString().trim().length === 0) {
            error.hourly = "Hour's is Required *"
        }
        if (form.pricing.daily.toString().trim().length === 0) {
            error.daily = "Daily is Required *"
        }
        if (form.pricing.monthly.toString().trim().length === 0) {
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
        formData.append("Area", form.Area);
        formData.append("vehicles", form.vehicles);
        formData.append("totalSlot", form.totalSlot);
        formData.append("vendorId", user?._id);
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
                .then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                        navigate("/mySlot");
                    }
                });
        } else {
            formData.append("slotId", Data._id);
            dispatch(updateSlot({ formData }))
                .then((res) => {
                    if (res.meta.requestStatus === "fulfilled") {
                        navigate("/mySlot");
                    }
                });
        }

    };

    const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition placeholder-slate-400";
    const labelClass = "block text-sm font-bold text-slate-700 mb-2";
    const errorClass = "text-rose-500 text-sm font-semibold mt-1.5 flex items-center gap-1";

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl hover:bg-white transition shadow-sm border border-transparent hover:border-slate-200 cursor-pointer mb-6"
                >
                    <ArrowLeft size={18} /> Back to My Slots
                </button>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
                            <ParkingCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            {Data === null ? "Add Parking Slot" : "Update Parking Slot"}
                        </h2>
                    </div>

                    {serverError && (
                        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                    <AlertTriangle size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Configuration Alert</h3>
                                    <div className="text-sm text-rose-600 font-bold">
                                        {Array.isArray(serverError) ? (
                                            <ul className="list-disc list-inside">
                                                {serverError.map((err, idx) => <li key={idx}>{err}</li>)}
                                            </ul>
                                        ) : typeof serverError === "string" ? (
                                            serverError
                                        ) : (
                                            "There was an error saving your slot configuration."
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setServerError(null)} className="p-2.5 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors">
                                <RefreshCcw size={20} />
                            </button>

                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><MapPin size={14} /> Slot Name</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                placeholder="e.g., Sunshine Parking Complex"
                                name="name"
                                onChange={handleChange}
                                onBlur={() => {
                                    if (form.name.trim().length === 0) {
                                        setError({ ...Error, name: "Name is Required *" })
                                    }
                                }}
                                className={inputClass}
                            />
                            {Error.name && <p className={errorClass}><AlertCircle size={14} />{Error.name}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Address</label>
                            <input
                                type="text"
                                value={form.address}
                                placeholder="Full street address"
                                name="address"
                                onChange={handleChange}
                                onBlur={() => {
                                    if (form.address.trim().length === 0) {
                                        setError({ ...Error, address: "Address is Required *" })
                                    }
                                }}
                                className={inputClass}
                            />
                            {Error.address && <p className={errorClass}><AlertCircle size={14} />{Error.address}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Area / Locality</label>
                            <input
                                type="text"
                                value={form.Area}
                                placeholder="e.g., Koramangala, Bangalore"
                                name="Area"
                                onChange={handleChange}
                                onBlur={() => {
                                    if (form.Area.trim().length === 0) {
                                        setError({ ...Error, Area: "Area is Required *" })
                                    }
                                }}
                                className={inputClass}
                            />
                            {Error.Area && <p className={errorClass}><AlertCircle size={14} />{Error.Area}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><Car size={14} /> Vehicle Type</span>
                            </label>
                            <div
                                className="flex gap-3"
                                onBlur={() => {
                                    if (form.vehicles.trim().length === 0) {
                                        setError({ ...Error, vehicles: "Vehicles is Required *" })
                                    }
                                }}
                            >
                                {["bike", "car"].map((type) => (
                                    <label
                                        key={type}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${form.vehicles === type ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}
                                    >
                                        <input
                                            type="radio"
                                            value={type}
                                            name="vehicles"
                                            onChange={handleChange}
                                            checked={form.vehicles === type}
                                            className="hidden"
                                        />
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </label>
                                ))}
                            </div>
                            {Error.vehicles && <p className={errorClass}><AlertCircle size={14} />{Error.vehicles}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><LayoutGrid size={14} /> Total Slots</span>
                            </label>
                            <input
                                type="text"
                                value={form.totalSlot}
                                placeholder="Number of parking slots"
                                name="totalSlot"
                                onChange={handleChange}
                                onBlur={() => {
                                    if (form.totalSlot.trim().length === 0) {
                                        setError({ ...Error, totalSlot: "Slot is Required *" })
                                    }
                                }}
                                className={inputClass}
                            />
                            {Error.totalSlot && <p className={errorClass}><AlertCircle size={14} />{Error.totalSlot}</p>}
                        </div>

                        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                            <label className="block text-sm font-bold text-indigo-700 mb-4">
                                <span className="flex items-center gap-2"><IndianRupee size={14} /> Pricing</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Per Hour", name: "hourly", errorKey: "hourly" },
                                    { label: "Daily", name: "daily", errorKey: "daily" },
                                    { label: "Monthly", name: "monthly", errorKey: "monthly" },
                                ].map(({ label, name, errorKey }) => (
                                    <div key={name}>
                                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{label}</label>
                                        <input
                                            type="text"
                                            value={form.pricing[name]}
                                            name={name}
                                            onChange={handlePricingChange}
                                            onBlur={() => {
                                                if (form.pricing[name].toString().trim().length === 0) {
                                                    setError({ ...Error, [errorKey]: `${label} is Required *` })
                                                }
                                            }}
                                            placeholder="₹"
                                            className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 mt-1"
                                        />
                                        {Error[errorKey] && <p className={errorClass}><AlertCircle size={14} />{Error[errorKey]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><Shield size={14} /> Facilities</span>
                            </label>
                            <input
                                type="text"
                                value={form.facilities.join(",")}
                                name="facilities"
                                placeholder="CCTV, Security, EV Charging..."
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
                                className={inputClass}
                            />
                            <p className="text-xs text-slate-400 font-medium mt-1">Separate multiple facilities with commas</p>
                            {Error.facilities && <p className={errorClass}><AlertCircle size={14} />{Error.facilities}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>
                                <span className="flex items-center gap-2"><Image size={14} /> Slot Images</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="parkingImages"
                                    multiple
                                    onChange={(e) =>
                                        setForm({ ...form, parkingImages: [...e.target.files] })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-600 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                            </div>
                            {Error.parkingImages && <p className={errorClass}><AlertCircle size={14} />{Error.parkingImages}</p>}
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-indigo-600" /> Property Documents
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Document Type</label>
                                    <select
                                        value={form.propertyDocument.documentType}
                                        name="documentType"
                                        onChange={handlePropertyChange}
                                        onBlur={() => {
                                            if (form.propertyDocument.documentType.trim().length === 0) {
                                                setError({ ...Error, documentType: "Document Type is Required *" })
                                            }
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="">Select Document Type</option>
                                        <option value="registration-document">Registration Document</option>
                                        <option value="rental-document">Rental Document</option>
                                    </select>
                                    {Error.documentType && <p className={errorClass}><AlertCircle size={14} />{Error.documentType}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Upload Proof</label>
                                    <input
                                        type="file"
                                        name="proof"
                                        multiple
                                        onChange={handlePropertyProof}
                                        className="w-full px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-600 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    />
                                    {Error.proof && <p className={errorClass}><AlertCircle size={14} />{Error.proof}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}  
                            className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-lg tracking-tight flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                            <ParkingCircle size={20} />
                            {/* {loading ? "Adding..." : Data ? "Update Slot" : "Register Parking Slot"} */}
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    {Data ? "Processing..." : "Processing..."}
                                </>
                            ) : (
                                Data ? "Update Slot" : "Register Slot"
                            )}  
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}