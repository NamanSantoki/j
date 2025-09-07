import { Link, useNavigate } from "react-router-dom";
import icon from "../components/icon.jpg"; // make sure icon.png is in the same directory

export default function Navbar() {
  const navigate = useNavigate();

  function handleAddEmployee() {
    navigate("/employee"); // Navigate to Employee page
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Company Name */}
          <div className="flex items-center space-x-3">
            <img
              src={icon}
              alt="Logo"
              className="h-10 w-10 rounded-full border-2 border-indigo-500 shadow-md"
            />
            <span className="text-2xl font-extrabold text-indigo-400 tracking-wide">
              Jalaram
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/attendance"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Attendance
            </Link>
            <Link
              to="/extra-hours"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Extra Hours
            </Link>
            <Link
              to="/employee"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Employees
            </Link>
            <Link
              to="/loanadvance"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Loan/Advance
            </Link>
            <Link
              to="/report"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Report
            </Link>
            <Link
              to="/settings"
              className="hover:text-indigo-400 transition duration-200 hover:scale-105"
            >
              Settings
            </Link>
          </div>

          {/* Quick Action Button */}
          <div>
            <button
              onClick={handleAddEmployee}
              className="bg-indigo-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-indigo-700 hover:shadow-indigo-500/50 transition duration-300 transform hover:scale-105"
            >
              + Add Employee
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
