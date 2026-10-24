import React, { useState } from "react";
import SideBar from "./Sidebar";
import policiesData from "../utilis/policiesData.json"; // Path check kar lijiye
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AttendancePolicies = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [openItems, setOpenItems] = useState({ 0: true });

  const { policies, barData, pieData } = policiesData;

  const togglePolicy = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex w-full font-sans">
      <SideBar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main className="flex-1 min-w-0 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Attendance Policies & Limits
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rules, operational hours, leave criteria, and monthly allowances.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Accordion Policies */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {policies.map((policy, index) => {
              const isOpen = !!openItems[index];

              return (
                <div
                  key={policy.id || index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => togglePolicy(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                        <i className={`${policy.icon} text-base`}></i>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">
                        {policy.title}
                      </h4>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 ml-2">
                      <i
                        className={`fa-solid ${
                          isOpen ? "fa-minus text-blue-900" : "fa-plus"
                        } text-sm`}
                      ></i>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      <p>{policy.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Recharts Bar & Pie Chart */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Shift Hours Threshold (Hours)
              </h3>
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#172554" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">
                Monthly Days Distribution
              </h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={40}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendancePolicies;