import React from "react";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";

const ReportGenerator = ({ data, filename, label }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
      <div>
        <h4 className="text-gray-900 font-semibold">{label}</h4>
        <p className="text-gray-500 text-sm">{data.length} records found</p>
      </div>
      <CSVLink
        data={data}
        filename={filename}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm shadow-sm"
      >
        <Download size={16} />
        Download CSV
      </CSVLink>
    </div>
  );
};

export default ReportGenerator;
