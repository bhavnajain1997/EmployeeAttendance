
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SideBar from "./Sidebar";

// Agar backend kisi aur port par hai, to URL update karna.
const API_URL = "http://localhost:5000";

// Late arrival ka demo rule: check-in 9:30 AM ke baad.
// Apni actual office policy ke according change kar sakti ho.
const LATE_AFTER_MINUTES = 9 * 60 + 30;

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return parts;
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setApiError("");

        const [employeesResponse, attendanceResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/employees`),
            fetch(`${API_URL}/api/attendance`),
          ]);

        if (!employeesResponse.ok || !attendanceResponse.ok) {
          throw new Error("Dashboard data load nahi ho paya.");
        }

        const employeesData = await employeesResponse.json();
        const attendanceData = await attendanceResponse.json();

        setEmployees(
          Array.isArray(employeesData) ? employeesData : []
        );

        setAttendance(
          Array.isArray(attendanceData) ? attendanceData : []
        );
      } catch (error) {
        setApiError(
          "Backend connect nahi ho raha. Check karo ki server port 5000 par running hai."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = getToday();

  const todayAttendance = attendance.filter(
    (record) => record.date === today
  );

  const presentToday = todayAttendance.filter(
    (record) =>
      record.checkIn &&
      ["Present", "Late"].includes(record.status)
  ).length;

  const lateArrivals = todayAttendance.filter((record) => {
    if (!record.checkIn) return false;

    const checkInDate = new Date(record.checkIn);

    const timeInIndia = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(checkInDate);

    const [hours, minutes] = timeInIndia.split(":").map(Number);

    return hours * 60 + minutes > LATE_AFTER_MINUTES;
  }).length;

  const cardGradientStyle = {
    backgroundImage:
      "radial-gradient(circle at 50% 20%, #0f1e46, #070e24, #020617)",
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const cards = [
    {
      title: "Total Employees",
      value: employees.length,
      color: "text-white",
    },
    {
      title: "Present Today",
      value: presentToday,
      color: "text-emerald-400",
    },
    {
      title: "Late Arrivals",
      value: lateArrivals,
      color: "text-amber-400",
    },
    {
      title: "WFH Requests Pending",
      value: "API not connected",
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex w-full font-sans">
      <SideBar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main className="flex-1 min-w-0 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-700 text-sm">
          <div>
            <span className="font-semibold text-slate-900">
              Employee ID:
            </span>{" "}
            VX-101
          </div>

          <div>
            <span className="font-semibold text-slate-900">
              Name:
            </span>{" "}
            Admin User
          </div>

          <div>
            <span className="font-semibold text-slate-900">
              Designation:
            </span>{" "}
            HR Operations
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <span className="font-semibold text-slate-900">
              Date:
            </span>{" "}
            {formatDate(new Date())}
          </div>
        </div>

        {apiError && (
          <p className="text-sm text-red-600">{apiError}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              style={cardGradientStyle}
              className="text-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-h-[130px] border border-slate-800"
            >
              <h2 className="text-sm font-medium text-slate-300">
                {card.title}
              </h2>

              <p className={`text-3xl font-bold tracking-tight ${card.color}`}>
                {loading ? "..." : card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-start sm:justify-end mt-4">
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white p-2">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full border-0 font-sans"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
