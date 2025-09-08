import { useState, useEffect } from "react";
import { TrashIcon } from '@heroicons/react/24/outline'; // ensure heroicons installed

export default function LoanAdvanceCards() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeLoan, setSelectedEmployeeLoan] = useState("");
  const [selectedEmployeeAdvance, setSelectedEmployeeAdvance] = useState("");
  const [loanEntries, setLoanEntries] = useState([]);
  const [advanceEntries, setAdvanceEntries] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://j-uzbc.onrender.com/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch entries
  const fetchEntries = async (employeeId, type) => {
    if (!employeeId) return;
    try {
      const res = await fetch(`https://j-uzbc.onrender.com/api/loan-advance/${employeeId}`);
      const data = await res.json();
      if (type === "Loan") setLoanEntries(data.filter(e => e.type === "Loan" || e.type === "RepaidLoan"));
      else setAdvanceEntries(data.filter(e => e.type === "Advance"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);
  useEffect(() => { fetchEntries(selectedEmployeeLoan, "Loan"); }, [selectedEmployeeLoan]);
  useEffect(() => { fetchEntries(selectedEmployeeAdvance, "Advance"); }, [selectedEmployeeAdvance]);

  const handleAdd = async (type) => {
    const employeeId = type === "Loan" ? selectedEmployeeLoan : selectedEmployeeAdvance;
    const amount = type === "Loan" ? loanAmount : advanceAmount;
    if (!employeeId || !amount) {
      setMessage("Please select an employee and enter amount");
      return;
    }
    try {
      const res = await fetch("https://j-uzbc.onrender.com/api/loan-advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, type, amount }),
      });
      if (res.ok) {
        setMessage(`${type} added successfully!`);
        if (type === "Loan") setLoanAmount("");
        else setAdvanceAmount("");
        fetchEntries(employeeId, type);
      } else setMessage(`Error adding ${type}`);
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to backend");
    }
  };

  const handleRepay = async () => {
    const employeeId = selectedEmployeeLoan;
    if (!repayAmount || repayAmount <= 0) {
      setMessage("Enter valid repayment amount");
      return;
    }
    try {
      const res = await fetch("https://j-uzbc.onrender.com/api/loan-advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, type: "RepaidLoan", amount: repayAmount }),
      });
      if (res.ok) {
        setMessage("Repayment added successfully!");
        setRepayAmount("");
        fetchEntries(employeeId, "Loan");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to backend");
    }
  };

  // Delete entry
  const handleDelete = async (id, type, employeeId) => {
    if (!window.confirm("Are you sure to delete this entry?")) return;
    try {
      const res = await fetch(`https://j-uzbc.onrender.com/api/loan-advance/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Deleted successfully!");
        fetchEntries(employeeId, type === "Advance" ? "Advance" : "Loan");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to backend");
    }
  };

  const totalLoanRemaining = () => {
    let total = 0;
    loanEntries.forEach(e => {
      if (e.type === "Loan") total += e.amount;
      if (e.type === "RepaidLoan") total -= e.amount;
    });
    return total;
  };

  const renderLoanHistory = () => (
    <ul className="space-y-2 max-h-60 overflow-y-auto">
      {loanEntries.map(e => (
        <li key={e._id} className="flex justify-between items-center border p-2 rounded-md">
          <div>
            <span className={e.type === "RepaidLoan" ? "text-green-600" : "text-red-600"}>
              ₹{e.amount} ({e.type === "RepaidLoan" ? "Repaid" : "Loan"})
            </span>
            <br />
            <small className="text-gray-500">{new Date(e.date).toLocaleString()}</small>
          </div>
          <TrashIcon
            className="w-6 h-6 text-gray-600 hover:text-red-600 cursor-pointer"
            onClick={() => handleDelete(e._id, e.type, selectedEmployeeLoan)}
          />
        </li>
      ))}
    </ul>
  );
  const totalAdvanceTaken = () => {
    let total = 0;
    advanceEntries.forEach(e => {
      total += e.amount;
    });
    return total;
  };

  const renderAdvanceHistory = () => (
    <ul className="space-y-2 max-h-60 overflow-y-auto">
      {advanceEntries.map(e => (
        <li key={e._id} className="flex justify-between items-center border p-2 rounded-md">
          <div>
            <span className="text-red-600">₹{e.amount}</span>
            <br />
            <small className="text-gray-500">{new Date(e.date).toLocaleString()}</small>
          </div>
          <TrashIcon
  className="w-6 h-6 text-gray-600 hover:text-red-600 cursor-pointer ml-auto"
  onClick={() => handleDelete(e._id, "Advance", selectedEmployeeAdvance)}
/>

          <div className="mt-4 font-semibold text-gray-800">
  </div>
</li>

      ))}
    </ul>
    
  );
  


  return (
    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {message && <p className="col-span-2 text-green-600 font-semibold">{message}</p>}

      {/* Loan Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Loan</h2>
        <select
          value={selectedEmployeeLoan}
          onChange={(e) => setSelectedEmployeeLoan(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        >
          <option value="">Select Employee</option>
          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
        </select>

        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={loanAmount}
            onChange={e => setLoanAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <button onClick={() => handleAdd("Loan")} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
            Add
          </button>
        </div>

        {selectedEmployeeLoan && (
          <>
            <h3 className="font-semibold mb-2 text-gray-700">Loan History</h3>
            {renderLoanHistory()}

            <div className="flex space-x-2 mt-4">
              <input
                type="number"
                placeholder="Repay Amount"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
              <button onClick={handleRepay} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                Repay
              </button>
            </div>

            <div className="mt-4 font-semibold text-gray-800">
              Total Loan Remaining: <span className="text-red-600">₹{totalLoanRemaining()}</span>
            </div>
          </>
        )}
      </div>

      {/* Advance Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Advance</h2>
        <select
          value={selectedEmployeeAdvance}
          onChange={(e) => setSelectedEmployeeAdvance(e.target.value)}
          className="w-full border rounded-md px-3 py-2 mb-4"
        >
          <option value="">Select Employee</option>
          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
        </select>

        <div className="flex space-x-2 mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={advanceAmount}
            onChange={e => setAdvanceAmount(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />
          <button onClick={() => handleAdd("Advance")} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
            Add
          </button>
        </div>

        {selectedEmployeeAdvance && (
          <>
            <h3 className="font-semibold mb-2 text-gray-700">Advance History</h3>
            {renderAdvanceHistory()}
          </>
        )}
        <br /><br />
        <h1>Total Advance Taken: <span className="text-red-600">₹{totalAdvanceTaken()}</span></h1>

      </div>
    </div>
  );
}
