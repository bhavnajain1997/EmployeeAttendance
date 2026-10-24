
import React, { useEffect, useState } from "react";
import SideBar from "./Sidebar";

const API_URL = "http://localhost:5000";

const WfhRequests = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch WFH requests from backend
  const fetchRequests = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/api/wfh`);

      if (!response.ok) {
        throw new Error("Unable to load WFH requests.");
      }

      const data = await response.json();

      setRequests(
        data.map((item) => ({
          ...item,
          id: item._id,
          empId: item.employeeId,
          name: item.employeeName || "Unknown Employee",
          role: item.designation || "Employee",
          eligibility: item.eligibility || "Not available",
          eligible: item.eligible ?? true,
        }))
      );
    } catch (err) {
      setError("Backend connect nahi ho raha. Server check karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve / Reject and save to database
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(`${API_URL}/api/wfh/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update request.");
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: data.status } : req
        )
      );
    } catch (err) {
      setError(err.message || "Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (selectedFilter === "All") return true;
    return req.status === selectedFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
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
              WFH Requests
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review, approve, or reject employee remote work applications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-950 border border-blue-200">
              Pending: {requests.filter((r) => r.status === "Pending").length}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedFilter === tab
                    ? "bg-blue-950 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 hidden sm:block">
            Monthly Cap: Max 4 Days
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-5">Employee</th>
                  <th className="py-4 px-5">Required Date</th>
                  <th className="py-4 px-5">Reason</th>
                  <th className="py-4 px-5">Eligibility</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center">
                      Loading WFH requests...
                    </td>
                  </tr>
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition duration-150"
                    >
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.empId} • {item.role}
                        </div>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap font-medium text-slate-800">
                        {item.date}
                      </td>

                      <td className="py-4 px-5 text-xs text-slate-600 max-w-xs leading-relaxed">
                        {item.reason}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                            item.eligible
                              ? "bg-slate-100 text-slate-700 border-slate-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {item.eligibility}
                        </span>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap text-center">
                        {item.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={updatingId === item.id}
                              onClick={() =>
                                handleStatusChange(item.id, "Approved")
                              }
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              {updatingId === item.id ? "Saving..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={updatingId === item.id}
                              onClick={() =>
                                handleStatusChange(item.id, "Rejected")
                              }
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400 text-sm"
                    >
                      No WFH requests found under this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WfhRequests;
