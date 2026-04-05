
import { Link, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// component 
import DashBoard from "./Component/Dashboard.jsx";
import Register from "./Component/register.jsx";
import Login from "./Component/login.jsx";
import MyMap from "./config/mapComponent.jsx";
import AddParkingSlot from "./Component/owner/AddParkingSlot.jsx";
import Mybookings from "./Component/Mybookings.jsx";
import BookSlot from "./Component/user/bookSlot.jsx";
import { UserAccount, logoutUser } from "./slices/authSlices.jsx";
import Payments from "./Component/user/payments.jsx";
import SlotBookingPage from "./Component/user/SlotBookingPage.jsx";
import ChatPage from "./Component/chatPage.jsx";
import MySlot from "./Component/owner/OwnSlot.jsx";
import Profile from "./Component/Profile.jsx";
import ForgotPassword from "./Component/ForgotPassword.jsx";
import { switchRole } from "./slices/authSlices.jsx";
import Notification from "./Component/notification.jsx";
import SwitchRole from "./Component/SwitchRole.jsx";



import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => {
    return state.auth;
  });
  const [AccountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(UserAccount());
    }
  }, [dispatch]);

  const handleChangeRole = async () => {
    const result = await dispatch(switchRole(user._id));

    if (result.meta.requestStatus === "fulfilled") {
      setAccountOpen(false);
      navigate("/dashboard");
    }
  };

  if (localStorage.getItem("token") && isLoggedIn == false) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }



  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className=" bg-gray-100">
        <nav className="bg-white shadow-md px-6 py-4 flex justify-end items-center">
          <div>
            {isLoggedIn == true && user.role == "admin" && (
              <>
                <ul className="flex gap-6 items-center">
                  <li><Link to="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition" > DashBoard </Link></li>
                  <li><Link to="/profile" className="text-gray-700 font-medium hover:text-blue-600 transition">Profile</Link></li>
                  <li><Notification /></li>


                  <li>
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        navigate("/login");
                      }}
                      className="text-red-500 font-medium hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </li>
                </ul>

              </>
            )}

          </div>


          <div>
            {isLoggedIn == true && user.role == "vendor" && (
              <>
                <ul className="flex gap-6 items-center">
                  <li><Link to="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition" > DashBoard </Link></li>
                  <li><Link to="/addparkingslot" className="text-gray-700 font-medium hover:text-blue-600 transition"> Add Slot</Link></li>
                  <li><Link to="/mybookings" className="text-gray-700 font-medium hover:text-blue-600 transition">Recently Booked Slot</Link></li>
                  <li><Link to="/mySlot" className="text-gray-700 font-medium hover:text-blue-600 transition">My Slot</Link></li>
                  <li><Link to="/profile" className="text-gray-700 font-medium hover:text-blue-600 transition">Profile</Link></li>
                  <li><Notification /></li>
                  <li><SwitchRole /></li>
                  <li>
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        navigate("/login");
                      }}
                      className="text-red-500 font-medium hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </li>
                </ul>

              </>
            )}

          </div>
          <div>
            {isLoggedIn == true && user.role == "user" && (
              <>
                <ul className="flex gap-6 items-center">
                  <li><Link to="/dashboard" className="text-gray-700 font-medium hover:text-blue-600 transition" > DashBoard </Link></li>
                  <li><Link to="/bookSlot" className="text-gray-700 font-medium hover:text-blue-600 transition"> BookSlot</Link></li>
                  <li><Link to="/mybookings" className="text-gray-700 font-medium hover:text-blue-600 transition">MyBookings</Link></li>
                  <li><Link to="/mypayments" className="text-gray-700 font-medium hover:text-blue-600 transition">Payments Histroy</Link></li>
                  <li><Link to="/profile" className="text-gray-700 font-medium hover:text-blue-600 transition">Profile</Link></li>
                  <li><Notification /></li>
                  <li><SwitchRole /></li>
                  <li>
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        navigate("/login");
                      }}
                      className="text-red-500 font-medium hover:text-red-700 transition"
                    >
                      Logout
                    </button>
                  </li>
                </ul>

              </>
            )}

          </div>
        </nav >


        <div className="p-6">
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
          </Routes>
        </div>


      </div >
    </GoogleOAuthProvider>
  )
}

export default App;
