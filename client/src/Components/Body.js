
import { createHashRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import AttendancePolicies from "./AttendancePolicies";
import AttendanceRecord from "./AttendanceRecord";
import WfhRequests from "./WfhRequests";
import QRCode from "./QRCode";

const Body = () => {
  const appRouter = createHashRouter([
    {
      path: "/",
      element: <Login navigate={(path) => {
        window.location.hash = `#${path}`;
      }} />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/employees",
      element: <Employees />,
    },
    {
      path: "/attendancepolicies",
      element: <AttendancePolicies />,
    },
    {
      path: "/attendancerecords",
      element: <AttendanceRecord />,
    },
    {
      path: "/wfhrequests",
      element: <WfhRequests />,
    },
    {
      path: "/qrcode",
      element: <QRCode />,
    },
  ]);

  return (
    <div
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 20%, #0f1e46, #070e24, #020617)",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
