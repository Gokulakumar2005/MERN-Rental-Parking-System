import React from "react";
import { FileText } from "lucide-react";
import { generateReportPDF } from "../../utils/pdfGenerator";

const ReportGenerator = ({ data, label, type }) => {
  const handleDownloadPDF = () => {
    generateReportPDF(type, data);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 className="text-gray-900 font-bold text-base">{label}</h4>
        <p className="text-gray-500 text-sm mt-0.5">{data ? data.length : 0} records found</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2.5 rounded-xl transition-all font-bold text-xs sm:text-sm shadow-md shadow-indigo-100 hover:shadow-indigo-200"
        >
          <FileText size={16} />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;
