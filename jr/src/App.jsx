import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Attendance from "./Pages/Attendance";
import LoanAdvance from "./pages/LoanAdvance";
import Report from "./Pages/Report";
import Settings from "./Pages/Settings";
import ExtraHour from "./Pages/ExtraHours";
import Employee from "./Pages/Employee";


function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Login outside of Layout (no Navbar on login page) */}
      <Route path="/login" element={<Login />} />

      {/* Protected area with Navbar */}
      <Route element={<Layout />}>
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/loanadvance" element={<LoanAdvance />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/extra-hours" element={<ExtraHour />} />

        {/* Redirect root to login */}
        <Route index element={<Navigate to="/login" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
