import { useState, useEffect } from "react";

export default function Employee() {
  const [name, setName] = useState("");
  const [salaryBreakup, setSalaryBreakup] = useState({
    basic: "",
    hra: "",
    conveyance: "",
    others: "",
  });
  const [shift, setShift] = useState("8hrs");
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null); // For update mode

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://jr-dtx9.onrender.com/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSalaryChange = (e) => {
    setSalaryBreakup({ ...salaryBreakup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = { 
      name, 
      shift, 
      salaryBreakup: {
        basic: Number(salaryBreakup.basic || 0),
        hra: Number(salaryBreakup.hra || 0),
        conveyance: Number(salaryBreakup.conveyance || 0),
        others: Number(salaryBreakup.others || 0),
      }
    };

    try {
      const url = editingId
        ? `https://jr-dtx9.onrender.com/api/employees/${editingId}`
        : "https://jr-dtx9.onrender.com/api/employees";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (res.ok) {
        setMessage(editingId ? "Employee updated successfully!" : "Employee added successfully!");
        setName("");
        setSalaryBreakup({ basic: "", hra: "", conveyance: "", others: "" });
        setShift("8hrs");
        setEditingId(null);
        fetchEmployees();
      } else {
        setMessage("Error saving employee");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to backend");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const res = await fetch(`https://jr-dtx9.onrender.com/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Employee deleted successfully!");
        fetchEmployees();
      } else {
        setMessage("Error deleting employee");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to backend");
    }
  };

  const handleEdit = (emp) => {
    setName(emp.name);
    setSalaryBreakup({
      basic: emp.salaryBreakup?.basic || "",
      hra: emp.salaryBreakup?.hra || "",
      conveyance: emp.salaryBreakup?.conveyance || "",
      others: emp.salaryBreakup?.others || "",
    });
    setShift(emp.shift);
    setEditingId(emp._id);
  };

  const calculateTotal = (salary) => {
    return Number(salary.basic || 0) + Number(salary.hra || 0) + Number(salary.conveyance || 0) + Number(salary.others || 0);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingId ? "Update Employee" : "Add Employee"}
      </h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Name */}
        <div>
          <label className="block text-gray-700">Employee Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Salary Inputs */}
        <div>
          <label className="block text-gray-700 mb-1">Salary Breakdown</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="basic"
              value={salaryBreakup.basic}
              onChange={handleSalaryChange}
              placeholder="Basic Salary"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              type="number"
              name="hra"
              value={salaryBreakup.hra}
              onChange={handleSalaryChange}
              placeholder="HRA"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              name="conveyance"
              value={salaryBreakup.conveyance}
              onChange={handleSalaryChange}
              placeholder="Conveyance"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              name="others"
              value={salaryBreakup.others}
              onChange={handleSalaryChange}
              placeholder="Others"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Shift */}
        <div>
          <label className="block text-gray-700 mb-1">Shift</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="shift"
                value="8hrs"
                checked={shift === "8hrs"}
                onChange={(e) => setShift(e.target.value)}
              />
              <span>8 hrs</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="shift"
                value="12hrs"
                checked={shift === "12hrs"}
                onChange={(e) => setShift(e.target.value)}
              />
              <span>12 hrs</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee List */}
      <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Employee List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Basic</th>
              <th className="py-2 px-4 border-b text-left">HRA</th>
              <th className="py-2 px-4 border-b text-left">Conveyance</th>
              <th className="py-2 px-4 border-b text-left">Others</th>
              <th className="py-2 px-4 border-b text-left">Total</th>
              <th className="py-2 px-4 border-b text-left">Shift</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{emp.name}</td>
                <td className="py-2 px-4 border-b">{emp.salaryBreakup.basic}</td>
                <td className="py-2 px-4 border-b">{emp.salaryBreakup.hra}</td>
                <td className="py-2 px-4 border-b">{emp.salaryBreakup.conveyance}</td>
                <td className="py-2 px-4 border-b">{emp.salaryBreakup.others}</td>
                <td className="py-2 px-4 border-b">{calculateTotal(emp.salaryBreakup)}</td>
                <td className="py-2 px-4 border-b">{emp.shift}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
