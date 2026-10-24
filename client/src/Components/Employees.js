
import React, { useState, useEffect } from "react";
import SideBar from "./Sidebar";

const API = "http://localhost:5000/api/employees";

const Employees = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newEmp, setNewEmp] = useState({
    name: "",
    empId: "",
    department: "",
    email: "",
    status: "Active",
  });

  // Load employees from MongoDB
  const fetchEmployees = async () => {
    try {
      setError("");

      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load employees. Please check the server and API.");
      }

      const data = await response.json();

      setEmployees(
        data.map((emp) => ({
          ...emp,
          id: emp.employeeId,
          department: emp.designation || emp.department || "General",
          status: emp.status || "Active",
        }))
      );
    } catch (err) {
      setError(
        "Unable to load employees. Please check the server and API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add employee to MongoDB
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: newEmp.empId.trim().toUpperCase(),
          name: newEmp.name.trim(),
          designation: newEmp.department.trim() || "General",
          email: newEmp.email.trim(),
          role: "employee",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to save employee."
        );
      }

      setNewEmp({
        name: "",
        empId: "",
        department: "",
        email: "",
        status: "Active",
      });

      setIsModalOpen(false);
      await fetchEmployees();

      alert("Employee added successfully!");
    } catch (err) {
      alert(
        err.message || "Failed to add employee. Please check the server."
      );
    }
  };

  // Delete employee from MongoDB
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete employee.");
      }

      await fetchEmployees();
      alert("Employee deleted successfully!");
    } catch (err) {
      alert(
        err.message || "Failed to delete employee. Please try again."
      );
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (emp.id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

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
              Employee Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage staff accounts, departments, and active portal credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-950 border border-blue-200">
              Total Staff: {employees.length}
            </span>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-950 text-white hover:bg-blue-900 transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <i className="fa-solid fa-user-plus"></i>
              Add Employee
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>

            <input
              type="text"
              placeholder="Enter Employee Name or Employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950 transition"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-4 px-5">Name</th>
                  <th className="py-4 px-5">Employee ID</th>
                  <th className="py-4 px-5">Department</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center">
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="py-4 px-5 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-950 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {(emp.name || "?").charAt(0)}
                          </div>
                          <span>{emp.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-slate-600 font-semibold whitespace-nowrap">
                        {emp.id}
                      </td>

                      <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                        {emp.department}
                      </td>

                      <td className="py-4 px-5 text-slate-500 whitespace-nowrap">
                        {emp.email || "—"}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${
                            emp.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(emp.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                          title="Remove Employee"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-slate-400 text-sm"
                    >
                      {error ||
                        "No employees found. Add an employee to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Add New Employee
                </h3>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-sm"
                  aria-label="Close dialog"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleAddEmployee}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newEmp.name}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP-106"
                      value={newEmp.empId}
                      onChange={(e) =>
                        setNewEmp({ ...newEmp, empId: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Engineering"
                      value={newEmp.department}
                      onChange={(e) =>
                        setNewEmp({ ...newEmp, department: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={newEmp.email}
                    onChange={(e) =>
                      setNewEmp({ ...newEmp, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-950"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition"
                  >
                    Save Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Employees;
