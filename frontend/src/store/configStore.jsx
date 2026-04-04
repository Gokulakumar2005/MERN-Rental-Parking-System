import { configureStore } from "@reduxjs/toolkit";
import authSlices from "../slices/authSlices.jsx";
import ParkingSlices from "../slices/parkingSlot.jsx"
import BookingSlices from "../slices/BookingSlices.jsx";


const store=configureStore({
    reducer:{
        auth:authSlices,
        slot:ParkingSlices,
        booking:BookingSlices,

    }
})
export default store;