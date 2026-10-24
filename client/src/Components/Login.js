
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!employeeId.trim() || !password.trim()) {
      setError("Please enter Employee ID and Password.");
      return;
    }

    if (
      employeeId.trim().toUpperCase() === "EMP-101" &&
      password === "1234"
    ) {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Invalid Employee ID or Password.");
    }
  };

  return (
    <div className="font-sans min-h-screen w-full flex justify-center items-center px-4 py-8 sm:py-16">
      <div
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        className="w-full max-w-[450px] mx-auto rounded-xl p-6 sm:p-10 flex flex-col gap-6 shadow-lg"
      >
        <div>
          <h2 className="text-center font-bold text-xl sm:text-2xl text-white tracking-wide">
            Employee Attendance System
          </h2>
        </div>

        <div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="EmpId" className="text-sm font-medium text-white">
                EmployeeID
              </label>
              <input
                id="EmpId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Your Employee ID"
                style={{ border: "1px solid white", color: "white" }}
                className="w-full bg-transparent p-2.5 rounded text-sm placeholder-gray-300 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="Password" className="text-sm font-medium text-white">
                Password
              </label>
              <input
                id="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                style={{ border: "1px solid white", color: "white" }}
                className="w-full bg-transparent p-2.5 rounded text-sm placeholder-gray-300 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              style={{ border: "1px solid white", color: "white" }}
              className="w-full mt-2 py-2.5 text-base sm:text-lg font-medium rounded hover:bg-white/10 active:scale-[0.99] transition cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
