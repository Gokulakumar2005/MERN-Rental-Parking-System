import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import { MapPin, Info, LayoutGrid, Award, ShieldCheck, Car } from "lucide-react";

export default function AllParkingSlots() {
    const dispatch = useDispatch();
    const { Slot } = useSelector((state) => state.slot);

    useEffect(() => {
        dispatch(FetchSlots())
    }, [dispatch])

   return (
    <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Parking Infrastructure</h1>
                    <p className="text-gray-500 mt-2 font-medium">Oversee all registered parking locations</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="font-bold text-gray-700">{Slot?.length || 0} Listed Facilities</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Slot]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((ele, i) => {
                        return (
                            <div
                                key={i}
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

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <LayoutGrid size={14} />
                                                <span className="font-bold uppercase tracking-tighter">Total Slots</span>
                                            </div>
                                            <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{ele.totalSlot}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Award size={14} />
                                                <span className="font-bold uppercase tracking-tighter">Vehicle</span>
                                            </div>
                                            <span className="font-bold text-indigo-600 uppercase tracking-widest">{ele.vehicles}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {Array.isArray(ele.facilities) && ele.facilities.map((fac, idx) => (
                                            <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                                <ShieldCheck size={10} />
                                                {fac}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Vendor ID</p>
                                            <p className="text-xs font-medium text-gray-600 truncate max-w-[120px]">{ele.vendorId}</p>
                                        </div>
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm">
                                            <Info size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    </div>
)
}

// address
// :
// "Basavangudi ,bangalore"
// createdAt
// :
// "2026-04-05T06:46:42.404Z"
// facilities
// :
// (3) ['CCTV', 'Security', 'Ev charging portal']
// location
// :
// {geo: {…}, type: 'Point'}
// name
// :
// "Rani Apartment"
// parkingImages
// :
// (5) ['https://res.cloudinary.com/dfkdmwudp/image/upload/…slots/1775371599152-WIN_20260309_19_31_16_Pro.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…371599202-WIN_20260309_19_31_17_Pro%20%282%29.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…371599207-WIN_20260309_19_31_17_Pro%20%283%29.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…slots/1775371599215-WIN_20260309_19_31_17_Pro.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…371599220-WIN_20260309_19_31_18_Pro%20%282%29.jpg']
// pricing
// :
// {hourly: 10, daily: 30, monthly: 100}
// propertyDocument
// :
// {documentType: 'registration-document', proof: Array(5)}
// totalSlot
// :
// 7
// updatedAt
// :
// "2026-04-05T06:46:42.404Z"
// vehicles
// :
// "car"
// vendorId
// :
// "69d1f61a081d4e8bda7bb2de"
// __v
// :
// 0
// _id
// :
// "69d20552081d4e8bda7bb343"