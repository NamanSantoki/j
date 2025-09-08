import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Attendance from "./pages/Attendance";
import LoanAdvance from "./pages/LoanAdvance";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import ExtraHour from "./pages/ExtraHours";
import Employee from "./pages/Employee";
import AuthCard from "./pages/AuthCard";

// Layout with Navbar
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

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Auth page */}
      <Route path="/auth" element={<AuthCard />} />

      {/* Protected area with Navbar */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/loanadvance" element={<LoanAdvance />} />
        <Route path="/report" element={<Report />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/extra-hours" element={<ExtraHour />} />
      </Route>

      {/* Redirect root and unknown routes */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
