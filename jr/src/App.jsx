import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthCard from "./pages/AuthCard";   // ✅ new single card
import Attendance from "./pages/Attendance";
import LoanAdvance from "./pages/LoanAdvance";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import ExtraHour from "./pages/ExtraHours";
import Employee from "./pages/Employee";

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
      {/* AuthCard outside of Layout (no Navbar here) */}
      <Route path="/auth" element={<AuthCard />} />

      {/* Protected area with Navbar */}
      <Route element={<Layout />}>
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/loanadvance" element={<LoanAdvance />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/extra-hours" element={<ExtraHour />} />

        {/* Redirect root to AuthCard */}
        <Route index element={<Navigate to="/auth" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
