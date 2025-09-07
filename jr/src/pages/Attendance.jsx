import { useState, useEffect } from "react";
import ExtraHour from "./ExtraHours";
export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [attendance, setAttendance] = useState({});

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch saved attendance
  useEffect(() => {
    const fetchSavedAttendance = async () => {
      if (employees.length === 0) return;

      try {
        const res = await fetch(`http://localhost:5000/api/attendance/${month}`);
        const data = await res.json();

        const newAttendance = {};
        const [year, monthIndex] = month.split("-").map(Number);
        const daysInMonth = new Date(year, monthIndex, 0).getDate();

        employees.forEach(emp => {
          const saved = data.find(a => a.employeeId?._id === emp._id);
          const empData = {};

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex - 1, day);
            const isSunday = date.getDay() === 0;

            if (saved && saved.attendance && saved.attendance[day]) {
              empData[day] = saved.attendance[day];
            } else {
              empData[day] = isSunday ? "H" : "P";
            }
          }

          newAttendance[emp._id] = empData;
        });

        setAttendance(newAttendance);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedAttendance();
  }, [month, employees]);

  // Initialize employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleAttendance = (empId, day) => {
    const current = attendance[empId][day];
    if (current === "H") return; // do not change holidays
    const next = current === "P" ? "A" : "P";
    setAttendance({
      ...attendance,
      [empId]: { ...attendance[empId], [day]: next },
    });
  };

  const daysInMonth = new Date(
    ...month.split("-").map((x, i) => (i === 1 ? x : x - 1)),
    0
  ).getDate();

  // Save attendance to backend
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, attendance }),
      });
      if (res.ok) alert("Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Attendance Page</h1>

      {/* Month Selector */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
        <button
          onClick={handleSave}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Save Attendance
        </button>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1 sticky left-0 bg-gray-100 z-10">Employee</th>
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const date = new Date(month.split("-")[0], month.split("-")[1] - 1, day);
                const isSunday = date.getDay() === 0;
                return (
                  <th
                    key={day}
                    className={`border px-2 py-1 ${isSunday ? "bg-gray-200 text-red-600 font-bold" : ""}`}
                  >
                    {day}
                  </th>
                );
              })}
              
              <th className="border px-2 py-1">A</th>
              <th className="border px-2 py-1 bg-gray-100">Shift</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const empAttendance = attendance[emp._id] || {};
              const totalP = Object.values(empAttendance).filter(v => v === "P").length;
              const totalA = Object.values(empAttendance).filter(v => v === "A").length;

              return (
                <tr key={emp._id}>
                  <td className="border px-2 py-1 font-semibold sticky left-0 bg-gray-50">{emp.name}</td>
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const status = empAttendance[day] || "";
                    const isHoliday = status === "H";
                    return (
                      <td
                        key={day}
                        className={`border px-2 py-1 text-center cursor-pointer ${
                          isHoliday
                            ? "bg-gray-200 text-gray-500 font-bold"
                            : status === "P"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                        onClick={() => toggleAttendance(emp._id, day)}
                      >
                        {status}
                      </td>
                    );
                  })}
                  
                  <td className="border px-2 py-1 text-center">{totalA}</td>
                  <td className="border px-2 py-1 text-center">{emp.shift}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
      </div>
      
    </div>
  );
}
