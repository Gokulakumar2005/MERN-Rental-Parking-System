import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// component 
import DashBoard from "./Component/Dashboard.jsx";
import Register from "./Component/register.jsx";
import Login from "./Component/login.jsx";
import MyMap from "./config/mapComponent.jsx";
import AddParkingSlot from "./Component/owner/AddParkingSlot.jsx";
import Mybookings from "./Component/Mybookings.jsx";
import ReceivedBookings from "./Component/owner/ReceivedBookings.jsx";
import BookSlot from "./Component/user/bookSlot.jsx";
import { UserAccount } from "./slices/authSlices.jsx";
import Payments from "./Component/user/payments.jsx";
import SlotBookingPage from "./Component/user/SlotBookingPage.jsx";
import ChatPage from "./Component/chatPage.jsx";
import MySlot from "./Component/owner/OwnSlot.jsx";
import Profile from "./Component/Profile.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";
import AllUserInMap from "./Component/user/AllUserInMap.jsx";

import Notification from "./Component/notification.jsx";
import AllBookings from "./Component/admin/AllBookings.jsx";
import AllUser from "./Component/admin/AllUsers.jsx";
import AllParkingSlots from "./Component/admin/AllParkingSlot.jsx";
import SlotApproval from "./Component/admin/SlotApproval.jsx";
import Navbar from "./Component/Navbar.jsx";
import PrivateRoutes from "./Component/privateRoutes.jsx";

// new pages
import Home from "./Component/guest/Home.jsx";
import About from "./Component/guest/About.jsx";
import Contact from "./Component/guest/Contact.jsx";
import AllContacts from "./Component/admin/AllContacts.jsx";



import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  // console.log("VITE_GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  // console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => {
    return state.auth;
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(UserAccount());
    }
  }, [dispatch]);



  if (localStorage.getItem("token") && isLoggedIn == false) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-black text-slate-400 tracking-widest uppercase animate-pulse">
            Syncing Session...
          </p>
        </div>
      </div>
    );
  }



  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <ToastContainer />
        <div className="max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            
            {/* Guest Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<PrivateRoutes><DashBoard /></PrivateRoutes>} />
            <Route path="/addparkingslot" element={<PrivateRoutes><AddParkingSlot /></PrivateRoutes>} />
            <Route path="/bookSlot" element={<PrivateRoutes><BookSlot /></PrivateRoutes>} />
            <Route path="/map" element={<PrivateRoutes><MyMap /></PrivateRoutes>} />
            <Route path="/mybookings" element={<PrivateRoutes><Mybookings /></PrivateRoutes>} />
            <Route path="/receivedbookings" element={<PrivateRoutes><ReceivedBookings /></PrivateRoutes>} />
            <Route path="/mypayments" element={<PrivateRoutes><Payments /></PrivateRoutes>} />
            <Route path="/slotbookingpage" element={<PrivateRoutes><SlotBookingPage /></PrivateRoutes>} />
            <Route path="/chatPage" element={<PrivateRoutes><ChatPage /></PrivateRoutes>} />
            <Route path="/mySlot" element={<PrivateRoutes><MySlot /></PrivateRoutes>} />
            <Route path="/profile" element={<PrivateRoutes><Profile /></PrivateRoutes>} />
            <Route path="/notification" element={<PrivateRoutes><Notification /></PrivateRoutes>} />
            <Route path="/AllUserInMap" element={<PrivateRoutes><AllUserInMap /></PrivateRoutes>} />
            
            <Route path="/Allusers" element={<PrivateRoutes>< AllUser /></PrivateRoutes>} />
            <Route path="/AllParkingSlot" element={<PrivateRoutes><AllParkingSlots /></PrivateRoutes>} />
            <Route path="/AllBookings" element={<PrivateRoutes><AllBookings /></PrivateRoutes>} />
            <Route path="/slotApproval" element={<PrivateRoutes><SlotApproval /></PrivateRoutes>} />
            <Route path="/admin/contacts" element={<PrivateRoutes><AllContacts /></PrivateRoutes>} />
          </Routes>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App;