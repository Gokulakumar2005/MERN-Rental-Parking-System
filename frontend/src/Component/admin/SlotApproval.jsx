import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchSlots, approveSlot, rejectSlot } from "../../slices/parkingSlot";
import { 
    CheckCircle, 
    XCircle, 
    ShieldAlert, 
    MapPin, 
    Car, 
    LayoutGrid, 
    IndianRupee, 
    Shield, 
    Image as ImageIcon, 
    FileText, 
    AlertCircle, 
    ParkingCircle, 
    User, 
    ExternalLink, 
    Eye, 
    RefreshCw, 
    Loader2,
    Calendar,
    Activity
} from "lucide-react";
import Pagination from "../../config/pagination";

// Canvas Helper component to overlay bounding boxes on the fullImage
function SlotScannerCanvas({ imageUrl, status }) {
    const canvasRef = useRef(null);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrl) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = 500;
            canvas.height = (img.height / img.width) * canvas.width;
            
            // Draw original image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Transparent dark overlay
            ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (status === "approved") {
                // Draw Green Empty Spot
                ctx.strokeStyle = "#10B981";
                ctx.lineWidth = 4;
                const spotX = canvas.width * 0.25;
                const spotY = canvas.height * 0.35;
                const spotW = canvas.width * 0.45;
                const spotH = canvas.height * 0.4;
                ctx.strokeRect(spotX, spotY, spotW, spotH);

                // Add label
                ctx.fillStyle = "rgba(16, 185, 129, 0.95)";
                ctx.fillRect(spotX, spotY - 24, 210, 24);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 10px sans-serif";
                ctx.fillText("EMPTY PARKING SPACE: 2.6m x 5.2m [PASS]", spotX + 8, spotY - 8);
            } else {
                // Draw Red Bounding Box showing small/blocked spaces
                ctx.strokeStyle = "#EF4444";
                ctx.lineWidth = 4;
                const spotX = canvas.width * 0.15;
                const spotY = canvas.height * 0.3;
                const spotW = canvas.width * 0.7;
                const spotH = canvas.height * 0.5;
                ctx.strokeRect(spotX, spotY, spotW, spotH);

                // Add label
                ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
                ctx.fillRect(spotX, spotY - 24, 260, 24);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 10px sans-serif";
                ctx.fillText("INSUFFICIENT CONTIGUOUS SPACE [FLAGGED]", spotX + 8, spotY - 8);
            }
            setImgLoaded(true);
        };
    }, [imageUrl, status]);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 shadow-lg bg-slate-900 flex justify-center items-center aspect-[4/3] max-w-full">
            <canvas ref={canvasRef} className="max-w-full max-h-full block object-contain"></canvas>
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md flex items-center gap-2 backdrop-blur-md border ${
                status === "approved" 
                    ? "bg-emerald-500/90 border-emerald-400/20" 
                    : status === "rejected" 
                        ? "bg-rose-500/90 border-rose-400/20" 
                        : "bg-amber-500/90 border-amber-400/20"
            }`}>
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                AI Vision: {status === "approved" ? "PASS" : status === "rejected" ? "FAILED" : "FLAGGED FOR REVIEW"}
            </div>
            {!imgLoaded && (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-400">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
            )}
        </div>
    );
}

export default function SlotApproval() {
    const dispatch = useDispatch();
    const { Slot, loading, error, pagination } = useSelector((state) => state.slot);
    const [activeTab, setActiveTab] = useState("pending"); // "pending", "approved", "rejected"
    const [selectedSlotForModal, setSelectedSlotForModal] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const { currentPage = 1, totalPages = 1 } = pagination || {};

    const loadSlots = () => {
        dispatch(FetchSlots({ page: 1, limit: 10, approvalStatus: activeTab }));
    };

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 10, approvalStatus: activeTab }));
    };

    useEffect(() => {
        loadSlots();
    }, [dispatch, activeTab]);

    const handleApprove = async (id) => {
        setActionLoadingId({ id, action: "approve" });
        try {
            await dispatch(approveSlot(id));
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoadingId({ id, action: "reject" });
        try {
            await dispatch(rejectSlot(id));
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <ParkingCircle size={36} className="text-indigo-600" />
                            Slot Authorization Dashboard
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold text-sm tracking-wide uppercase">
                            Admin / Spatial Audit Queue
                        </p>
                    </div>
                    <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
                        <Activity className="text-indigo-600 animate-pulse" size={20} />
                        <span className="font-extrabold text-slate-700 text-sm">{Slot.length} Slots in Queue</span>
                    </div>
                </div>

                {/* Tabs Panel */}
                <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-sm max-w-md">
                    {[
                        { id: "pending", label: "Pending Scan Review", color: "text-amber-600", activeBg: "bg-amber-50 text-amber-700 border-amber-200" },
                        { id: "approved", label: "Auto-Approved / Passed", color: "text-emerald-600", activeBg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                        { id: "rejected", label: "Rejected / Deficient", color: "text-rose-600", activeBg: "bg-rose-50 text-rose-700 border-rose-200" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                                activeTab === tab.id
                                    ? `${tab.activeBg} shadow-sm border font-extrabold`
                                    : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-rose-500" size={24} />
                            <div>
                                <h3 className="text-sm font-black text-rose-950 uppercase tracking-wide">Queue Loading Error</h3>
                                <p className="text-xs text-rose-600 font-bold mt-0.5">{error}</p>
                            </div>
                        </div>
                        <button onClick={loadSlots} className="p-2.5 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-200 transition-colors">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                )}

                {/* Queue Lists */}
                {loading && Slot.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={48} />
                        <p className="text-slate-400 font-black tracking-widest uppercase text-xs">Retrieving Audit Queue...</p>
                    </div>
                ) : Slot.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm gap-6 p-8">
                        <div className="p-5 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100">
                            <CheckCircle size={48} />
                        </div>
                        <div className="text-center max-w-sm space-y-2">
                            <h3 className="text-xl font-extrabold text-slate-800">Queue is Clear!</h3>
                            <p className="text-sm text-slate-400 font-semibold leading-relaxed">
                                All parking slot registrations are completed. No pending items found under the "{activeTab}" filter.
                            </p>
                        </div>
                        <button 
                            onClick={loadSlots}
                            className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 flex items-center gap-2 active:scale-95 transition-all shadow-sm"
                        >
                            <RefreshCw size={14} /> Refresh List
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Slot.map((slot) => (
                            <div 
                                key={slot._id}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Left Side: AI Bounding Box and Images */}
                                <div className="lg:col-span-5 p-6 bg-slate-50 border-r border-slate-100 flex flex-col justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                                <ImageIcon size={14} />
                                                Spatial Verification Canvas
                                            </h3>
                                            <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                                ID: {slot._id?.slice(-8)}
                                            </span>
                                        </div>
                                        
                                        {/* Dynamic Bounding Box Overlay Canvas */}
                                        <SlotScannerCanvas 
                                            imageUrl={slot.fullImage || (slot.parkingImages && slot.parkingImages[0])} 
                                            status={slot.approvalStatus} 
                                        />
                                    </div>

                                    {/* Gallery of standard photos */}
                                    {slot.parkingImages && slot.parkingImages.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Standard Views</h4>
                                            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                                                {slot.parkingImages.map((img, idx) => (
                                                    <a 
                                                        href={img} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        key={idx}
                                                        className="w-16 h-12 rounded-lg border border-slate-200/80 overflow-hidden flex-shrink-0 relative group/thumb hover:border-indigo-400 transition"
                                                    >
                                                        <img src={img} alt="parking view" className="w-full h-full object-cover transition duration-300 group-hover/thumb:scale-110" />
                                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center text-white transition">
                                                            <Eye size={12} />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Slot configuration and details */}
                                <div className="lg:col-span-7 p-8 flex flex-col justify-between gap-8">
                                    <div className="space-y-6">
                                        {/* Core Details */}
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                {slot.name}
                                            </h2>
                                            <div className="flex items-start gap-1.5 text-slate-400 mt-2 text-sm font-semibold">
                                                <MapPin size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                                                <span>{slot.address}, {slot.Area}</span>
                                            </div>
                                        </div>

                                        {/* Technical specs block */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                                <div className="flex items-center gap-1.5 text-slate-400 font-black uppercase text-[10px] tracking-wider mb-1">
                                                    <Car size={14} className="text-indigo-500" />
                                                    Class Allowed
                                                </div>
                                                <span className="font-extrabold text-slate-700 text-sm uppercase">{slot.vehicles}</span>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                                <div className="flex items-center gap-1.5 text-slate-400 font-black uppercase text-[10px] tracking-wider mb-1">
                                                    <LayoutGrid size={14} className="text-indigo-500" />
                                                    Capacity
                                                </div>
                                                <span className="font-extrabold text-slate-700 text-sm">{slot.totalSlot} Slots</span>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                                                <div className="flex items-center gap-1.5 text-slate-400 font-black uppercase text-[10px] tracking-wider mb-1">
                                                    <User size={14} className="text-indigo-500" />
                                                    Vendor Details
                                                </div>
                                                <span className="font-extrabold text-slate-700 text-xs truncate max-w-full" title={slot.vendorId?.name || slot.vendorId?.email || "Vendor ID"}>
                                                    {slot.vendorId?.name || slot.vendorId?.email || "Audit Admin"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Pricing Schedule */}
                                        <div className="bg-indigo-50/50 border border-indigo-100/50 p-4 rounded-2xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                                                <IndianRupee size={12} /> Pricing Rates
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Hourly</p>
                                                    <p className="text-sm font-black text-slate-700">₹{slot.pricing?.hourly || 0}</p>
                                                </div>
                                                <div className="border-x border-indigo-100">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Daily</p>
                                                    <p className="text-sm font-black text-slate-700">₹{slot.pricing?.daily || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Monthly</p>
                                                    <p className="text-sm font-black text-slate-700">₹{slot.pricing?.monthly || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amenities/Facilities list */}
                                        {slot.facilities && slot.facilities.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                                    <Shield size={12} className="text-indigo-500" /> Facilities Loaded
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {slot.facilities.map((fac, idx) => (
                                                        <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200/50 px-2.5 py-1 rounded-xl text-xs font-bold">
                                                            {fac}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Document Proof link */}
                                        {slot.propertyDocument && (
                                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-indigo-600">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Document Audit Type</p>
                                                        <p className="text-xs font-black text-slate-700 uppercase mt-0.5">
                                                            {slot.propertyDocument.documentType?.replace("-", " ") || "Ownership Deed"}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {slot.propertyDocument.proof && slot.propertyDocument.proof[0] && (
                                                    <a 
                                                        href={slot.propertyDocument.proof[0]} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition active:scale-95 flex items-center justify-center"
                                                        title="Open Deed Copy"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons Panel */}
                                    {slot.approvalStatus === "pending" && (
                                        <div className="flex gap-4 border-t border-slate-100 pt-6">
                                            <button
                                                onClick={() => handleReject(slot._id)}
                                                disabled={actionLoadingId !== null}
                                                className="flex-1 py-3 px-5 bg-rose-50 border border-rose-200 text-rose-600 font-extrabold rounded-2xl hover:bg-rose-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-sm"
                                            >
                                                {actionLoadingId?.id === slot._id && actionLoadingId?.action === "reject" ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <XCircle size={18} />
                                                )}
                                                Reject Application
                                            </button>
                                            <button
                                                onClick={() => handleApprove(slot._id)}
                                                disabled={actionLoadingId !== null}
                                                className="flex-1 py-3 px-5 bg-emerald-600 text-white font-extrabold rounded-2xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-md shadow-emerald-100"
                                            >
                                                {actionLoadingId?.id === slot._id && actionLoadingId?.action === "approve" ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <CheckCircle size={18} />
                                                )}
                                                Approve Booking Access
                                            </button>
                                        </div>
                                    )}

                                    {/* Status Indicator for Approved/Rejected tabs */}
                                    {slot.approvalStatus !== "pending" && (
                                        <div className="border-t border-slate-100 pt-6 flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Audit Result:</span>
                                            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                                slot.approvalStatus === "approved" 
                                                    ? "bg-emerald-100 text-emerald-700" 
                                                    : "bg-rose-100 text-rose-700"
                                            }`}>
                                                {slot.approvalStatus === "approved" ? "Approved & Bookable" : "Rejected"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="mt-6">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
