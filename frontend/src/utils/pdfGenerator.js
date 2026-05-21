import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Utility to generate modern, beautiful PDF reports client-side.
 * Supports bookings, payments, user directories, and single-user details.
 */
export const generateReportPDF = (type, data = [], extraInfo = {}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Theme Colors ---
  const primaryColor = [79, 70, 229]; // Indigo (#4F46E5)
  const secondaryColor = [71, 85, 105]; // Slate (#475569)
  const successColor = [16, 185, 129]; // Emerald (#10B981)
  const darkTextColor = [17, 24, 39]; // Slate 900 (#111827)
  const lightTextColor = [107, 114, 128]; // Gray 500 (#6B7280)
  const borderColor = [229, 231, 235]; // Gray 200 (#E5E7EB)

  // --- Helper: Draw Header Banner ---
  const drawHeaderBanner = (title, subtitle) => {
    // Top banner background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 15, 18);

    // Subtitle / Brand
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("RENTAL PARKING SYSTEM  |  ADMINISTRATIVE REPORT", 15, 25);

    // Metadata Right-Aligned
    const now = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.text(`Generated: ${now}`, pageWidth - 15, 15, { align: "right" });
    doc.text(`Scope: ${subtitle}`, pageWidth - 15, 22, { align: "right" });
    doc.text("Status: Verified Active", pageWidth - 15, 29, { align: "right" });
  };

  // --- Helper: Draw Footer ---
  const drawFooter = () => {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(...borderColor);
      doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...lightTextColor);
      doc.text("Confidential - For Internal Administrative Use Only", 15, pageHeight - 10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: "right" });
    }
  };

  // --- Action based on report type ---
  if (type === "bookings") {
    drawHeaderBanner("Platform Bookings", `${data.length} records`);

    const tableHeaders = [["#", "Area", "Vehicle No.", "Type", "Status", "Amount", "Start Time", "End Time"]];
    const tableRows = data.map((b, i) => [
      i + 1,
      b.Area || "N/A",
      b.vehiclesNumber || "N/A",
      b.vehicletype || "N/A",
      b.status || "Booked",
      `INR ${b.Amount || 0}`,
      b.startTime ? new Date(b.startTime).toLocaleString() : "N/A",
      b.endTime ? new Date(b.endTime).toLocaleString() : "N/A",
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableRows,
      startY: 48,
      margin: { left: 15, right: 15 },
      theme: "striped",
      headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 2.5, textColor: darkTextColor },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 35 },
        2: { cellWidth: 22 },
        3: { cellWidth: 15 },
        4: { cellWidth: 18 },
        5: { cellWidth: 20 },
      },
    });

    drawFooter();
    doc.save("all_bookings_report.pdf");

  } else if (type === "payments") {
    drawHeaderBanner("Transaction Summary", `${data.length} transactions`);

    const tableHeaders = [["#", "Payment ID", "User ID", "Amount", "Date", "Vehicle No."]];
    const tableRows = data.map((p, i) => [
      i + 1,
      p.paymentId || "N/A",
      p.userId || "N/A",
      `INR ${p.amount || 0}`,
      p.date || "N/A",
      p.vehicle || "N/A",
    ]);

    const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    // Table
    autoTable(doc, {
      head: tableHeaders,
      body: tableRows,
      startY: 48,
      margin: { left: 15, right: 15 },
      theme: "striped",
      headStyles: { fillColor: primaryColor, fontSize: 9, fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 3, textColor: darkTextColor },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    // Summary box
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, finalY, pageWidth - 30, 20, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...darkTextColor);
    doc.text(`TOTAL REVENUE COLLECTED IN BATCH: INR ${totalAmount.toLocaleString()}`, 20, finalY + 12);

    drawFooter();
    doc.save("transaction_report.pdf");

  } else if (type === "users") {
    drawHeaderBanner("User Directory", `${data.length} registered users`);

    const tableHeaders = [["#", "User Name", "Email Address", "Phone Number", "Role", "Wallet Balance", "Created Date"]];
    const tableRows = data.map((u, i) => [
      i + 1,
      u.userName || "N/A",
      u.email || "N/A",
      u.phoneNumber || "N/A",
      u.role || "N/A",
      `INR ${u.wallet || 0}`,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
    ]);

    autoTable(doc, {
      head: tableHeaders,
      body: tableRows,
      startY: 48,
      margin: { left: 15, right: 15 },
      theme: "striped",
      headStyles: { fillColor: primaryColor, fontSize: 8.5, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3, textColor: darkTextColor },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    drawFooter();
    doc.save("users_directory_report.pdf");

  } else if (type === "single_user") {
    const user = extraInfo.user || {};
    const userBookings = data || [];

    drawHeaderBanner("User Activity Report", `User: ${user.userName || "Details"}`);

    // --- Modern Profile Box ---
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(15, 48, pageWidth - 30, 42, 4, 4, "FD");

    // Profile Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text("ACCOUNT PROFILE OVERVIEW", 20, 56);

    // Profile Details Grid (2 columns)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...darkTextColor);
    doc.text("Name:", 20, 64);
    doc.text("Email:", 20, 70);
    doc.text("Phone:", 20, 76);
    doc.text("Role:", 20, 82);

    doc.setFont("helvetica", "normal");
    doc.text(user.userName || "N/A", 35, 64);
    doc.text(user.email || "N/A", 35, 70);
    doc.text(user.phoneNumber || "N/A", 35, 76);
    doc.text((user.role || "user").toUpperCase(), 35, 82);

    // Column 2
    doc.setFont("helvetica", "bold");
    doc.text("User ID:", 110, 64);
    doc.text("Wallet Bal:", 110, 70);
    doc.text("Joined On:", 110, 76);
    doc.text("Account:", 110, 82);

    doc.setFont("helvetica", "normal");
    doc.text(user._id || "N/A", 130, 64);
    doc.setTextColor(...successColor);
    doc.setFont("helvetica", "bold");
    doc.text(`INR ${user.wallet || 0}`, 130, 70);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkTextColor);
    doc.text(user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A", 130, 76);
    doc.text("Active / Verified", 130, 82);

    // --- Bookings Section Title ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text("PERSONAL BOOKING & ACTIVITY HISTORY", 15, 100);

    const userTypeString = user.role === "vendor" ? "vendorId" : "userId";
    const filteredBookings = userBookings.filter(
      (b) => b.userId === user._id || b.vendorId === user._id || b.userId?._id === user._id || b.vendorId?._id === user._id
    );

    if (filteredBookings.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(...lightTextColor);
      doc.text("No booking history or reservation activities found for this user account.", 15, 110);
    } else {
      const tableHeaders = [["#", "Area / Location", "Vehicle No.", "Type", "Status", "Amount", "Start Date & Time"]];
      const tableRows = filteredBookings.map((b, i) => [
        i + 1,
        b.Area || "N/A",
        b.vehiclesNumber || "N/A",
        b.vehicletype || "N/A",
        b.status || "Booked",
        `INR ${b.Amount || 0}`,
        b.startTime ? new Date(b.startTime).toLocaleString() : "N/A",
      ]);

      autoTable(doc, {
        head: tableHeaders,
        body: tableRows,
        startY: 104,
        margin: { left: 15, right: 15 },
        theme: "striped",
        headStyles: { fillColor: primaryColor, fontSize: 8.5, fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 2.5, textColor: darkTextColor },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
    }

    drawFooter();
    doc.save(`user_report_${user.userName || user._id}.pdf`);
  } else if (type === "revenue_monthly" || type === "revenue_yearly") {
    const isMonthly = type === "revenue_monthly";
    drawHeaderBanner(`${isMonthly ? "Monthly" : "Yearly"} Revenue Report`, `${data.length} transactions`);

    // Group data
    const grouped = {};
    data.forEach(p => {
       // p.date might be locale string, parse it or fallback to current
       const d = new Date(p.date || p.updatedAt);
       if (isNaN(d.getTime())) return;
       const key = isMonthly 
           ? `${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()}`
           : `${d.getFullYear()}`;
       
       if (!grouped[key]) {
           grouped[key] = { count: 0, revenue: 0 };
       }
       grouped[key].count += 1;
       grouped[key].revenue += (p.amount || 0);
    });

    const tableHeaders = [[isMonthly ? "Month" : "Year", "Total Transactions", "Total Revenue"]];
    const tableRows = Object.entries(grouped).map(([period, stats]) => [
       period,
       stats.count,
       `INR ${stats.revenue.toLocaleString()}`
    ]);

    const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0);

    // Table
    autoTable(doc, {
      head: tableHeaders,
      body: tableRows,
      startY: 48,
      margin: { left: 15, right: 15 },
      theme: "striped",
      headStyles: { fillColor: primaryColor, fontSize: 9, fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 3, textColor: darkTextColor },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    // Summary box
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(15, finalY, pageWidth - 30, 20, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...darkTextColor);
    doc.text(`TOTAL PLATFORM REVENUE: INR ${totalRevenue.toLocaleString()}`, 20, finalY + 12);

    drawFooter();
    doc.save(`revenue_report_${isMonthly ? "monthly" : "yearly"}.pdf`);
  }
};
