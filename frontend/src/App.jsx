
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";

// component 
import DashBoard from "./Component/Dashboard.jsx";
import Register from "./Component/register.jsx";
import Login from "./Component/login.jsx";
import MyMap from "./config/mapComponent.jsx";
import AddParkingSlot from "./Component/owner/AddParkingSlot.jsx";
import Mybookings from "./Component/Mybookings.jsx";
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
import Navbar from "./Component/Navbar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => {
    return state.auth;
  });


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(UserAccount());
    } else {
      navigate("/login")
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
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/addparkingslot" element={<AddParkingSlot />} />
            <Route path="/bookSlot" element={<BookSlot />} />
            <Route path="/map" element={<MyMap />} />
            <Route path="/mybookings" element={<Mybookings />} />
            <Route path="/mypayments" element={<Payments />} />
            <Route path="/slotbookingpage" element={<SlotBookingPage />} />
            <Route path="/chatPage" element={<ChatPage />} />
            <Route path="/mySlot" element={<MySlot />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/AllUserInMap" element={<AllUserInMap />} />
            <Route path="/Allusers" element={<AllUser />} />
            <Route path="/AllParkingSlot" element={<AllParkingSlots />} />
            <Route path="/AllBookings" element={<AllBookings />} />
          </Routes>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App;