
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchSlots } from "../../slices/parkingSlot";
import { useNavigate } from "react-router-dom";
import { deleteSlot } from "../../slices/parkingSlot";

export default function MySlot() {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const { Slot } = useSelector((state) => state.slot);
    const { user } = useSelector((state) => state.auth);
    // console.log({ " Data Inside the own Slot ": Slot });

    useEffect(() => {
        dispatch(FetchSlots());
    }, [dispatch]);
    const CommonId = Slot.filter((ele) => ele.vendorId === user?._id);
    // console.log({ "Common ID ": CommonId });
const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this slot?");
    
    if (confirmDelete) {
        dispatch(deleteSlot(id));
    }
};
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">

                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    My Slots
                </h2>

                {CommonId.length !== 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {[...CommonId]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((ele) => {
                                return (
                                    <div
                                        key={ele._id}
                                        className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300"
                                    >
                                        <h2 className="text-xl font-semibold text-indigo-600 mb-3">
                                            {ele.name}
                                        </h2>

                                        <div className="space-y-2 text-gray-700">
                                            <p>
                                                <span className="font-medium text-gray-900">Address:</span>{" "}
                                                {ele.address}
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-900">Vehicles:</span>{" "}
                                                {ele.vehicles}
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-900">Total Slots:</span>{" "}
                                                {ele.totalSlot}
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row w-full sm:space-x-4 space-y-3 sm:space-y-0 mt-6 px-4">
                                            <div >
                                                <button onClick={()=>navigate("/addparkingslot",{state:ele})}
                                                    className="flex-1 bg-green-400 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-500 transition duration-300 shadow-md transform hover:-translate-y-0.5">
                                                    Update Slot
                                                </button>
                                            </div>
                                            <div>
                                                <button onClick={() => handleDelete(ele._id)}
                                                    className="flex-1 bg-red-400 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-600 transition duration-300 shadow-md transform hover:-translate-y-0.5">
                                                    delete Slot
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-red-500 text-lg bg-white px-6 py-4 rounded-xl shadow">
                            No Slot Registered Yet.. Please register a slot.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}



// address
// :
// "Basavangudi ,bangalore"
// createdAt
// :
// "2026-04-03T10:12:19.638Z"
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
// (5) ['https://res.cloudinary.com/dfkdmwudp/image/upload/…slots/1775211133299-WIN_20260308_15_04_26_Pro.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…slots/1775211133314-WIN_20260308_15_04_30_Pro.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…slots/1775211133335-WIN_20260309_19_31_15_Pro.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…211135745-WIN_20260309_19_31_16_Pro%20%282%29.jpg', 'https://res.cloudinary.com/dfkdmwudp/image/upload/…211135752-WIN_20260309_19_31_16_Pro%20%283%29.jpg']
// pricing
// :
// {hourly: 20, daily: 100, monthly: 1000}
// propertyDocument
// :
// {documentType: 'registration-document', proof: Array(5)}
// totalSlot
// :
// 4
// updatedAt
// :
// "2026-04-03T10:12:19.638Z"
// vehicles
// :
// "bike"
// vendorId
// :
// "69cf9153f7e186fb9a8f562d"
// __v
// :
// 0
// _id
// :
// "69cf9283f7e186fb9a8f5640"