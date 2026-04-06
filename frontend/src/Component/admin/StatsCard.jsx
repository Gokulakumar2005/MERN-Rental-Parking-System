import React from "react";

const StatsCard = ({ title, value, icon, trend, color }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
  };

  return (
    <div className={`p-6 rounded-3xl border shadow-sm transition-all hover:shadow-xl ${colorMap[color] || "bg-white"} bg-opacity-50 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${colorMap[color]} shadow-inner text-2xl`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;
