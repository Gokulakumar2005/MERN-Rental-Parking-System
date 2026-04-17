import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import Pagination from "../../config/pagination";
import SearchBar from "../SearchBar";
import { MapPin, Info, LayoutGrid, Award, ShieldCheck, Car, Activity, AlertTriangle, RefreshCcw } from "lucide-react";

import debounce from "lodash/debounce";
import { useLocation } from "react-router-dom";

export default function AllParkingSlots() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { Slot, pagination, error: reduxError } = useSelector((state) => state.slot);
    const [serverError, setServerError] = useState(null);
    const { currentPage = 1, totalPages = 1, totalItems = 0 } = pagination || {};


    const queryParams = new URLSearchParams(location.search);
    const initialSearch = queryParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [vehicleType, setVehicleType] = useState("all");

    const debouncedFetch = useCallback(
        debounce((searchQuery, vehicleFilter) => {
            dispatch(FetchSlots({ page: 1, limit: 12, search: searchQuery, vehicleType: vehicleFilter }));
        }, 500),
        [dispatch]
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        debouncedFetch(value, vehicleType);
    };

    const handleVehicleChange = (value) => {
        setVehicleType(value);
        dispatch(FetchSlots({ page: 1, limit: 12, search, vehicleType: value }));
    };

    const handlePageChange = (page) => {
        dispatch(FetchSlots({ page, limit: 12, search, vehicleType }));
    };

    useEffect(() => {
        dispatch(FetchSlots({ page: 1, limit: 12, search: initialSearch, vehicleType: "all" }));
    }, [dispatch, initialSearch]);

    useEffect(() => {
        if (reduxError) {
            setServerError(reduxError);
        }
    }, [reduxError]);


    const filters = [
        { label: "All Vehicles", value: "all" },
        { label: "Cars Only", value: "car" },
        { label: "Bikes Only", value: "bike" }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Parking Infrastructure</h1>
                        <p className="text-gray-500 mt-2 font-medium">Oversee all registered parking locations</p>
                    </div>
                    <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-100 flex items-center gap-3 w-fit">
                        <Activity className="text-emerald-500 animate-pulse" size={20} />
                        <span className="font-bold text-gray-700">{totalItems} Listed Facilities</span>
                     </div>
                </div>

                {serverError && (
                    <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
                                <AlertTriangle size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Infrastructure Data Connection</h3>
                                <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "Unable to retrieve parking infrastructure details."}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setServerError(null);
                                dispatch(FetchSlots({ page: 1, limit: 12, search, vehicleType }));
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
                        >
                            <RefreshCcw size={16} />
                            <span className="hidden sm:inline">Retry Action</span>
                        </button>
                    </div>
                )}


                <div className="max-w-xl">
                    <SearchBar 
                        placeholder="Search by name, address or area..."
                        value={search}
                        onChange={handleSearchChange}
                        filters={filters}
                        activeFilter={vehicleType}
                        onFilterChange={handleVehicleChange}
                    />
                </div>

                {Slot.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Slot.map((ele, i) => (
                            <div
                                key={ele._id || i}
                                className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {ele.parkingImages?.[0] ? (
                                        <img
                                            src={ele.parkingImages[0]}
                                            alt={ele.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                            <Car size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-700 shadow-sm">
                                        ID: {ele._id.slice(-6)}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {ele.name}
                                    </h3>

                                    <div className="flex items-start gap-2 text-gray-500 mb-6">
                                        <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
                                        <p className="text-sm font-medium line-clamp-2">{ele.address}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <LayoutGrid size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Capacity</span>
                                            </div>
                                            <span className="text-lg font-black text-gray-900">{ele.totalSlot}</span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center">
                                            <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                <Award size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">Support</span>
                                            </div>
                                            <span className="text-lg font-bold text-indigo-600 uppercase tracking-widest">{ele.vehicles}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8 h-12 overflow-hidden">
                                        {Array.isArray(ele.facilities) && ele.facilities.map((fac, idx) => (
                                            <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                                <ShieldCheck size={10} />
                                                {fac}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="max-w-[70%]">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Vendor</p>
                                            <p className="text-xs font-medium text-gray-600 truncate" title={ele.vendorId}>{ele.vendorId}</p>
                                        </div>
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
                                            <Info size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
                        <MapPin className="mx-auto text-gray-200 mb-4" size={64} />
                        <h3 className="text-2xl font-bold text-gray-900">No parking slots found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">We couldn't find any facilities matching your current search or vehicle type criteria.</p>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-8 w-fit mx-auto">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>
        </div>
    );
}