
import React, { useState, useEffect } from "react";
import SideBar from "./Sidebar";

const AttendanceRecord = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/attendance");

        if (!response.ok) {
          throw new Error("Unable to load attendance records");
        }

        const data = await response.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load attendance. Please check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredRecords = records.filter((record) => {
    const employeeSearch = `${record.employeeId || ""} ${
      record.employeeName || ""
    }`.toLowerCase();

    const matchesSearch = employeeSearch.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      (record.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatTime = (date) => {
    if (!date) return "--";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "--";

    return value.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActiveHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "0h 00m";

    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
      return "0h 00m";
    }

    const totalMinutes = Math.floor((end - start) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  };

  const formatDate = (date) => {
    if (!date) return "--";

    const value = new Date(`${date}T00:00:00`);

    return Number.isNaN(value.getTime())
      ? date
      : value.toLocaleDateString("en-CA");
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "present":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "late":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "half day":
      case "half-day":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "absent":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full font-sans">
      <SideBar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main className="flex-1 min-w-0 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Attendance Records
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Daily employee check-in logs and status reports.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-950 border border-blue-200">
            Total Logs: {records.length}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none bg-white"
          >
            <option>All Status</option>
            <option>Present</option>
            <option>Late</option>
            <option>Half Day</option>
            <option>Absent</option>
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading attendance records...
            </p>
          ) : error ? (
            <p className="p-8 text-center text-rose-600">{error}</p>
          ) : filteredRecords.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No attendance records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-5">Employee ID</th>
                    <th className="py-4 px-5">Employee Name</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5">Check-In</th>
                    <th className="py-4 px-5">Check-Out</th>
                    <th className="py-4 px-5">Active Hours</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5 text-center">Regularize</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="py-4 px-5 font-medium text-slate-900">
                        {record.employeeId}
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-800">
                        {record.employeeName || "Unknown Employee"}
                      </td>
                      <td className="py-4 px-5 text-slate-500">
                        {formatDate(record.date)}
                      </td>
                      <td className="py-4 px-5">
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="py-4 px-5">
                        {formatTime(record.checkOut)}
                      </td>
                      <td className="py-4 px-5 font-semibold">
                        {getActiveHours(record.checkIn, record.checkOut)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                            record.status
                          )}`}
                        >
                          {record.status || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center text-slate-400">
                        —
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AttendanceRecord;
