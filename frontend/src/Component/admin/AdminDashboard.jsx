import React, { useEffect, useMemo } from "react";
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
import { FetchAllUser } from "../../slices/authSlices";
import { fetchBookings } from "../../slices/BookingSlices";
import { FetchSlots } from "../../slices/parkingSlot";
import StatsCard from "./StatsCard";
import ReportGenerator from "./ReportGenerator";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { Alluser } = useSelector((state) => state.auth);
  const { myBooking } = useSelector((state) => state.booking);
  const { Slot } = useSelector((state) => state.slot);

  useEffect(() => {
    dispatch(FetchAllUser());
    dispatch(fetchBookings());
    dispatch(FetchSlots());
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

  return (
  <div className="space-y-12 py-8 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <StatsCard
        title="Total Revenue"
        value={`₹${totalRevenue.toLocaleString()}`}
        icon="💰"
        trend={12}
        color="green"
      />
      <StatsCard
        title="Active Users"
        value={Alluser?.length || 0}
        icon="👥"
        trend={5}
        color="blue"
      />
      <StatsCard
        title="Parking Slots"
        value={Slot?.length || 0}
        icon="🅿️"
        color="purple"
      />
      <StatsCard
        title="Total Bookings"
        value={myBooking?.length || 0}
        icon="📅"
        trend={8}
        color="orange"
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
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
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
          />
          <ReportGenerator 
            data={paymentReportData} 
            filename="transaction_report.csv" 
            label="Transaction Summary" 
          />
          <ReportGenerator 
            data={Alluser || []} 
            filename="users_report.csv" 
            label="User Directory" 
          />
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
