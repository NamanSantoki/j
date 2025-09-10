import { useState, useEffect } from "react";


export default function Report() {
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [report, setReport] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`https://j-uzbc.onrender.com/api/report?month=${month}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month]);

  const getTotalDaysInMonth = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month, 0).getDate();
  };

  const calculateNet = (emp) => {
    const totalDays = getTotalDaysInMonth(month);
    const totalSalary = Number(emp.totalSalary || 0);
    const perDaySalary = totalSalary / totalDays;
    const perHour = emp.shift === "12hrs" ? perDaySalary / 12 : perDaySalary / 8;

    let net = totalSalary;

    if (emp.extraHours && emp.extraHours.length > 0) {
      emp.extraHours.forEach((rec) => {
        net += (Number(rec.extra) || 0) * perHour;
        net -= (Number(rec.late) || 0) * perHour;
      });
    }

    net -= perDaySalary * (Number(emp.absentDays) || 0);
    net -= Number(emp.advanceGiven || 0);

    return Math.round(net); // integer only
  };

  // Print whole report page (excluding controls)
  const handlePrintReport = () => {
    const content = document.getElementById("reportTable").outerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Monthly Report - ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: right; }
            th { background: #f0f0f0; }
            td:first-child, th:first-child { text-align: left; }
          </style>
        </head>
        <body>
          <h2>Monthly Report - ${month}</h2>
          ${content}
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Totals row calculation
  const totals = report.reduce(
    (acc, emp) => {
      acc.basic += emp.basic || 0;
      acc.hra += emp.hra || 0;
      acc.conveyance += emp.conveyance || 0;
      acc.others += emp.others || 0;
      acc.totalSalary += emp.totalSalary || 0;
      acc.advanceGiven += emp.advanceGiven || 0;
      acc.loanGiven += emp.loanGiven || 0;
      acc.loanRepaid += emp.loanRepaid || 0;
      acc.loanLeft += emp.loanLeft || 0;
      acc.netSalary += calculateNet(emp) || 0;
      return acc;
    },
    {
      basic: 0,
      hra: 0,
      conveyance: 0,
      others: 0,
      totalSalary: 0,
      advanceGiven: 0,
      loanGiven: 0,
      loanRepaid: 0,
      loanLeft: 0,
      netSalary: 0,
    }
  );

  return (
    <div className=" w-full h-full bg-blue-100 rounded-2xl p-4 mt-5">
      <h1 className="text-4xl  text-black font-bold mb-6">Monthly Report</h1>

      {/* Month Selector + Buttons */}
      <div className="mb-6 flex items-center gap-3">
        <label className=" text-blue-800 font-semibold">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded-md"
        />
        <button
          onClick={fetchReport}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
        <button
          onClick={handlePrintReport}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Print Report
        </button>
      </div>

      {/* Report Table */}
      <div className="w-full">
        <table
          id="reportTable"
          className="table-auto border-collapse border border-gray-100 w-full"
        >
          <thead className="bg-violet-300">
            <tr>
              <th className="border px-3 py-2">Employee</th>
              <th className="border px-3 py-2">Basic</th>
              <th className="border px-3 py-2">HRA</th>
              <th className="border px-3 py-2">Conveyance</th>
              <th className="border px-3 py-2">Other</th>
              <th className="border px-3 py-2">Total Salary</th>
              <th className="border px-3 py-2">Present Days</th>
              <th className="border px-3 py-2">Absent Days</th>
              <th className="border px-3 py-2">Advance Given</th>
              <th className="border px-3 py-2">Loan Given</th>
              <th className="border px-3 py-2">Loan Repaid</th>
              <th className="border px-3 py-2">Loan Left</th>
              <th className="border px-3 py-2">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {report.map((emp, idx) => (
              <tr key={idx}>
                <td className="border px-3 py-2 font-semibold">{emp.employeeName}</td>
                <td className="border px-3 py-2 text-right">{emp.basic}</td>
                <td className="border px-3 py-2 text-right">{emp.hra}</td>
                <td className="border px-3 py-2 text-right">{emp.conveyance}</td>
                <td className="border px-3 py-2 text-right">{emp.others}</td>
                <td className="border px-3 py-2 text-right">{emp.totalSalary}</td>
                <td className="border px-3 py-2 text-center">{emp.presentDays}</td>
                <td className="border px-3 py-2 text-center">{emp.absentDays}</td>
                <td className="border px-3 py-2 text-right">{emp.advanceGiven}</td>
                <td className="border px-3 py-2 text-right">{emp.loanGiven}</td>
                <td className="border px-3 py-2 text-right">{emp.loanRepaid}</td>
                <td className="border px-3 py-2 text-right">{emp.loanLeft}</td>
                <td
                  className={`border px-3 py-2 font-bold text-right ${
                    calculateNet(emp) < 0
                      ? "text-red-600"
                      : calculateNet(emp) > 0
                      ? "text-green-600"
                      : "text-yellow-100"
                  }`}
                >
                  {calculateNet(emp)}
                </td>
              </tr>
            ))}
            {/* Totals Row */}
            <tr className="bg-blue-300 font-bold">
              <td className="border px-3 py-2 text-center">TOTAL</td>
              <td className="border px-3 py-2 text-right">{totals.basic}</td>
              <td className="border px-3 py-2 text-right">{totals.hra}</td>
              <td className="border px-3 py-2 text-right">{totals.conveyance}</td>
              <td className="border px-3 py-2 text-right">{totals.others}</td>
              <td className="border  px-3 py-2 text-right">{totals.totalSalary}</td>
              <td className="border px-3 py-2"></td>
              <td className="border px-3 py-2"></td>
              <td className="border px-3 py-2 text-right">{totals.advanceGiven}</td>
              <td className="border px-3 py-2 text-right">{totals.loanGiven}</td>
              <td className="border px-3 py-2 text-right">{totals.loanRepaid}</td>
              <td className="border px-3 py-2 text-right">{totals.loanLeft}</td>
              <td className=" border px-3 py-2 text-right">{totals.netSalary}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
