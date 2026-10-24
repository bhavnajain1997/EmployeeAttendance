import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: "fa-brands fa-dashcube" },
    { title: "Employees", path: "/employees", icon: "fa-solid fa-users-line" },
    { title: "Attendance Records", path: "/attendancerecords", icon: "fa-solid fa-square-check" },
    { title: "WFH Requests", path: "/wfhrequests", icon: "fa-solid fa-house" },
    { title: "Attendance Policies", path: "/attendancepolicies", icon: "fa-solid fa-file-contract" },
    { title: "Report & Analytics", path: "/analytics", icon: "fa-solid fa-chart-simple" },
    { title: "Office QR Screen", path: "/qrcode", icon: "fa-solid fa-qrcode" },
  ];

  return (
    <aside
      className={`bg-blue-950 min-h-screen h-screen sticky top-0 left-0 z-50 flex flex-col shadow-xl select-none transition-all duration-300 ease-in-out shrink-0 ${
        isExpanded ? "w-[240px] px-3 py-4" : "w-[68px] px-2 py-4"
      }`}
    >
      {/* Top Header: Hamburger & Toggle Button */}
      <div className={`flex items-center mb-4 ${isExpanded ? "justify-between px-2" : "justify-center"}`}>
        {isExpanded && (
          <Link
            to="/dashboard"
            className="text-white font-bold text-base tracking-wide whitespace-nowrap overflow-hidden"
          >
            Attendance System
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-white/10 p-2 rounded-lg transition flex items-center justify-center cursor-pointer border border-white/20"
          title={isExpanded ? "Collapse Menu" : "Expand Menu"}
        >
          {isExpanded ? (
            <i className="fa-solid fa-xmark fa-times text-lg text-white"></i>
          ) : (
            <i className="fa-solid fa-bars text-lg text-white"></i>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col justify-between overflow-x-visible overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={index} className="relative group">
                <Link
                  to={item.path}
                  className={`rounded-xl transition duration-150 flex items-center ${
                    isExpanded
                      ? "flex-row gap-3.5 px-3 py-2.5 justify-start"
                      : "justify-center p-2.5"
                  } ${
                    isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <i
                    className={`${item.icon} text-blue-300 shrink-0 text-center ${
                      isExpanded ? "w-5 text-base" : "text-lg"
                    }`}
                  ></i>

                  {/* Expanded hone par inline text */}
                  {isExpanded && (
                    <span className="whitespace-nowrap text-sm font-medium transition-opacity duration-200">
                      {item.title}
                    </span>
                  )}
                </Link>

                {/* Hover Tooltip (Sirf jab sidebar collapsed/chhota ho) */}
                {!isExpanded && (
                  <div className="absolute left-[74px] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                    {/* Tooltip Arrow */}
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mr-1"></div>
                    {/* Tooltip Content */}
                    <span className="bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-xl border border-white/10 whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Logout Button with Tooltip */}
        <div className="pt-3 border-t border-white/10 mt-2 relative group">
          <Link
            to="/login"
            className={`rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition flex items-center ${
              isExpanded
                ? "flex-row gap-3.5 px-3 py-2.5 justify-start"
                : "justify-center p-2.5"
            }`}
          >
            <i
              className={`fa-solid fa-arrow-right-from-bracket shrink-0 text-center ${
                isExpanded ? "w-5 text-base" : "text-lg"
              }`}
            ></i>
            {isExpanded && (
              <span className="whitespace-nowrap text-sm font-medium">
                Logout
              </span>
            )}
          </Link>

          {/* Logout Tooltip */}
          {!isExpanded && (
            <div className="absolute left-[74px] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
              <div className="w-2 h-2 bg-slate-900 rotate-45 -mr-1"></div>
              <span className="bg-slate-900 text-rose-300 text-xs font-medium px-3 py-1.5 rounded-md shadow-xl border border-white/10 whitespace-nowrap">
                Logout
              </span>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;