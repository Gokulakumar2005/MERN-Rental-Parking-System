import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { AlertTriangle, RefreshCcw, FileText } from "lucide-react";

import { FetchAllUser } from "../../slices/authSlices";
import { fetchBookings } from "../../slices/BookingSlices";
import { FetchSlots } from "../../slices/parkingSlot";
import StatsCard from "./StatsCard";
import ReportGenerator from "./ReportGenerator";
import { generateReportPDF } from "../../utils/pdfGenerator";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { Alluser, pagination, Error: authError } = useSelector((state) => state.auth);
  const { myBooking, error: bookingError } = useSelector((state) => state.booking);
  const { Slot, error: slotError } = useSelector((state) => state.slot);
  const { pagination: bookingPagination } = useSelector((state) => state.booking);
  const { pagination: slotPagination } = useSelector((state) => state.slot)
  const [serverError, setServerError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleDownloadSingleUserPDF = () => {
    const selectedUser = Alluser?.find((u) => u._id === selectedUserId);
    if (selectedUser) {
      generateReportPDF("single_user", myBooking, { user: selectedUser });
    }
  };

  useEffect(() => {
    if (authError || bookingError || slotError) {
      setServerError(authError || bookingError || slotError);
    }
  }, [authError, bookingError, slotError]);


  useEffect(() => {
    dispatch(FetchAllUser({ page: 1, limit: 100 }));
    dispatch(fetchBookings({ page: 1, limit: 100 }));
    dispatch(FetchSlots({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Transform Data for Charts
  const bookingReportData = useMemo(() => {
    if (!myBooking) return [];
    return myBooking.map((b) => ({
      ...b,
      startTime: new Date(b.startTime).toLocaleString(),
      endTime: new Date(b.endTime).toLocaleString(),
      updatedAt: new Date(b.updatedAt).toLocaleString(),
    }));
  }, [myBooking]);

  const paymentReportData = useMemo(() => {
    if (!myBooking) return [];
    return myBooking.filter(b => b.status === "Booked" || b.status === "Completed").map((b) => ({
      paymentId: b.paymentId,
      amount: b.Amount,
      date: new Date(b.updatedAt).toLocaleDateString(),
      userId: b.userId,
      vehicle: b.vehiclesNumber
    }));
  }, [myBooking]);

  const userRoleData = useMemo(() => {
    if (!Alluser) return [];
    const roles = {};
    Alluser.forEach((u) => {
      roles[u.role] = (roles[u.role] || 0) + 1;
    });
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [Alluser]);

  const vehicleTypeData = useMemo(() => {
    if (!myBooking) return [];
    const types = {};
    myBooking.forEach((b) => {
      types[b.vehicletype] = (types[b.vehicletype] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [myBooking]);

  const monthlyRevenueData = useMemo(() => {
    if (!myBooking) return [];
    const months = {};
    myBooking.filter(b => b.status === "Booked" || b.status === "Completed").forEach((b) => {
      const month = new Date(b.updatedAt).toLocaleString("default", { month: "short" });
      months[month] = (months[month] || 0) + b.Amount;
    });
    return Object.entries(months).map(([name, revenue]) => ({ name, revenue }));
  }, [myBooking]);

  const totalRevenue = useMemo(() => {
    return myBooking?.filter(b => b.status === "Booked" || b.status === "Completed")
      .reduce((acc, curr) => acc + (curr.Amount || 0), 0) || 0;
  }, [myBooking]);

  const pendingSlotsCount = useMemo(() => {
    return Slot?.filter(s => s.approvalStatus === "pending")?.length || 0;
  }, [Slot]);

  const totalVendors = useMemo(() => {
    return Alluser?.filter(u => u.role === "vendor")?.length || 0;
  }, [Alluser]);

  return (
    <div className="space-y-12 py-8 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {serverError && (
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl mb-8 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm shadow-rose-100/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider mb-0.5">Dashboard Sync Error</h3>
              <p className="text-sm text-rose-600 font-bold">{typeof serverError === "string" ? serverError : "There was an error loading administrative analytics."}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setServerError(null);
              dispatch(FetchAllUser({ page: 1, limit: 24 }));
              dispatch(fetchBookings({ page: 1, limit: 24 }));
              dispatch(FetchSlots({ page: 1, limit: 24 }));
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-200"
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon="💰"
          trend={12}
          color="green"
        />
        <StatsCard
          title="Active Users"
          value={pagination?.totalItems || 0}
          icon="👥"
          trend={5}
          color="blue"
        />
        <StatsCard
          title="Parking Slots"
          value={slotPagination?.totalItems || 0}
          icon="🅿️"
          color="purple"
        />
        <StatsCard
          title="Total Bookings"
          value={bookingPagination?.totalItems || 0}
          icon="📅"
          trend={8}
          color="orange"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingSlotsCount}
          icon="🛡️"
          color="red"
        />
        <StatsCard
          title="Total Vendors"
          value={totalVendors}
          icon="🏪"
          trend={2}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">📈</span>
            Monthly Revenue Flow
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill="url(#colorRev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="p-2 bg-teal-100 text-teal-600 rounded-lg">📊</span>
            User Distribution
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">🚗</span>
            Vehicle Type Statistics
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip cursor={{ fill: "#F3F4F6" }} contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Bar dataKey="value" fill="#6366F1" radius={[10, 10, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <span className="p-2 bg-red-100 text-red-600 rounded-lg">📄</span>
            Platform Reports
          </h3>

          <div className="space-y-4">
            <ReportGenerator
              data={bookingReportData}
              filename="all_bookings_report.csv"
              label="Full Booking History"
              type="bookings"
            />
            <ReportGenerator
              data={paymentReportData}
              filename="transaction_report.csv"
              label="Transaction Summary"
              type="payments"
            />
            <ReportGenerator
              data={Alluser || []}
              filename="users_report.csv"
              label="User Directory"
              type="users"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              Single User Activity Report
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-grow bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select User Profile...</option>
                {Alluser?.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.userName} ({u.role})
                  </option>
                ))}
              </select>
              <button
                onClick={handleDownloadSingleUserPDF}
                disabled={!selectedUserId}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Download Report
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Financial Revenue Reports
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generateReportPDF("revenue_monthly", paymentReportData)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2 flex-1"
              >
                <FileText size={16} />
                Monthly Revenue PDF
              </button>
              <button
                onClick={() => generateReportPDF("revenue_yearly", paymentReportData)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-teal-100 hover:shadow-teal-200 transition-all flex items-center justify-center gap-2 flex-1"
              >
                <FileText size={16} />
                Yearly Revenue PDF
              </button>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
            <p className="text-sm text-gray-500 text-center">
              Export reports for analytics and auditing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
