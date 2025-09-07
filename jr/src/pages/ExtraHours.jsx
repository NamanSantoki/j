import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function ExtraHour() {
  const [employees, setEmployees] = useState([]);
  const [saved, setSaved] = useState({});
  const [expanded, setExpanded] = useState({}); // track expanded rows

  useEffect(() => {
    fetchEmployees();
    fetchSaved();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://jr-dtx9.onrender.com/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await fetch("https://jr-dtx9.onrender.com/api/extra-hours");
      const data = await res.json();

      const formatted = {};
      data.forEach((rec) => {
        if (!formatted[rec.employee._id]) {
          formatted[rec.employee._id] = { total: 0, records: [] };
        }
        formatted[rec.employee._id].total += rec.total;
        formatted[rec.employee._id].records.push({
          _id: rec._id, // keep record id for delete
          date: rec.date,
          late: rec.late,
          extra: rec.extra,
        });
      });

      setSaved(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (empId, late, extra) => {
    try {
      const res = await fetch("https://jr-dtx9.onrender.com/api/extra-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: empId,
          late: parseFloat(late || 0),
          extra: parseFloat(extra || 0),
        }),
      });
      const data = await res.json();

      // update saved state locally
      setSaved((prev) => {
        const existing = prev[empId] || { total: 0, records: [] };
        return {
          ...prev,
          [empId]: {
            total: existing.total + data.total,
            records: [
              ...existing.records,
              { _id: data._id, date: data.date, late: data.late, extra: data.extra },
            ],
          },
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (recordId, empId, value) => {
    try {
      await fetch(`https://jr-dtx9.onrender.com/api/extra-hours/${recordId}`, {
        method: "DELETE",
      });

      // update UI locally
      setSaved((prev) => {
        const existing = prev[empId];
        const updatedRecords = existing.records.filter((r) => r._id !== recordId);
        const updatedTotal = existing.total - value;

        return {
          ...prev,
          [empId]: {
            total: updatedTotal,
            records: updatedRecords,
          },
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Extra Hours / Late Arrival</h1>

      <table className="table-auto border-collapse border border-gray-300 w-3/4">
        <thead>
          <tr>
            <th className="border px-3 py-2">Employee</th>
            <th className="border px-3 py-2">Late (hrs)</th>
            <th className="border px-3 py-2">Extra (hrs)</th>
            <th className="border px-3 py-2">Action</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => {
            const empSaved = saved[emp._id] || { total: 0, records: [] };
            return (
              <>
                <tr key={emp._id}>
                  <td className="border px-3 py-2">{emp.name}</td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      onChange={(e) =>
                        setSaved((prev) => ({
                          ...prev,
                          [emp._id]: {
                            ...empSaved,
                            late: e.target.value,
                          },
                        }))
                      }
                      className="w-20 border rounded px-2 py-1"
                      min="0"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      onChange={(e) =>
                        setSaved((prev) => ({
                          ...prev,
                          [emp._id]: {
                            ...empSaved,
                            extra: e.target.value,
                          },
                        }))
                      }
                      className="w-20 border rounded px-2 py-1"
                      min="0"
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        handleSave(emp._id, empSaved.late, empSaved.extra)
                      }
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </td>
                  <td
                    className={`border px-3 py-2 font-bold text-center ${
                      empSaved.total < 0
                        ? "text-red-600"
                        : empSaved.total > 0
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {empSaved.total !== undefined ? empSaved.total : "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [emp._id]: !prev[emp._id],
                        }))
                      }
                      className="flex items-center justify-center w-full"
                    >
                      {expanded[emp._id] ? (
                        <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  </td>
                </tr>

                {/* Expanded details row */}
                {expanded[emp._id] && (
                  <tr>
                    <td colSpan="6" className="border px-3 py-2 bg-gray-50">
                      <table className="table-auto w-full border border-gray-200">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Late</th>
                            <th className="border px-2 py-1">Extra</th>
                            <th className="border px-2 py-1">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empSaved.records.map((rec, i) => (
                            <tr key={i}>
                              <td className="border px-2 py-1">{rec.date}</td>
                              <td
                                className={`border px-2 py-1 ${
                                  rec.late > 0 ? "text-red-600" : "text-gray-600"
                                }`}
                              >
                                {rec.late}
                              </td>
                              <td
                                className={`border px-2 py-1 ${
                                  rec.extra > 0
                                    ? "text-green-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {rec.extra}
                              </td>
                              <td className="border px-2 py-1 text-center">
                                <TrashIcon
                                  className="h-5 w-5 text-gray-600 hover:text-red-600 cursor-pointer"
                                  onClick={() =>
                                    handleDelete(rec._id, emp._id, rec.late * -1 + rec.extra)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
