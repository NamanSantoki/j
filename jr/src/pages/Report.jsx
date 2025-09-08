import { useState, useEffect } from "react";

export default function Report() {
  const [month, setMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );
  const [report, setReport] = useState([]);
  const [expanded, setExpanded] = useState({}); // Track expanded rows

  // Fetch report from backend
  const fetchReport = async () => {
    try {
      const res = await fetch(`https://j-backend.onrender.com/api/report?month=${month}`);
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month]);

  // Function to calculate adjusted net salary
  // Utility to get total days in month
  const getTotalDaysInMonth = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month, 0).getDate(); // last day of the month
  };

  // Function to calculate net salary
  const calculateNet = (emp) => {
    const totalDays = getTotalDaysInMonth(month); // month from state
    const totalSalary = Number(emp.totalSalary || 0);
    const perDaySalary = totalSalary / totalDays;
    const perHour = emp.shift === "12hrs" ? perDaySalary / 12 : perDaySalary / 8;

    let net = totalSalary;

    // Adjust for extra/late hours
    if (emp.extraHours && emp.extraHours.length > 0) {
      emp.extraHours.forEach((rec) => {
        const late = Number(rec.late || 0);
        const extra = Number(rec.extra || 0);
        net += extra * perHour;
        net -= late * perHour;
      });
    }

    // Subtract absent days
    net -= perDaySalary * (Number(emp.absentDays || 0));
    net -= Number(emp.advanceGiven || 0);

    return net.toFixed(2);
  };
  // Add this function inside your Report component
  const handlePrint = (emp) => {
    const totalDays = new Date(
      new Date(month + "-01").getFullYear(),
      new Date(month + "-01").getMonth() + 1,
      0
    ).getDate();

    const perDaySalary = emp.totalSalary / totalDays;
    const perHour = emp.shift === "12hrs" ? perDaySalary / 12 : perDaySalary / 8;

    let net = emp.totalSalary;

    // Extra/late hours adjustment
    if (emp.extraHours && emp.extraHours.length > 0) {
      emp.extraHours.forEach((rec) => {
        net += (rec.extra || 0) * perHour;
        net -= (rec.late || 0) * perHour;
      });
    }

    // Absent days deduction
    net -= perDaySalary * (emp.absentDays || 0);

    const slipWindow = window.open("", "_blank", "width=600,height=700");
    slipWindow.document.write(`
    <html>
  <head>
    <title>Salary Slip - ${emp.employeeName}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .header { display: flex; align-items: center; margin-bottom: 20px; }
      .logo { width: 20px; height: 20px; ; margin-right: 20px; }
      .title { text-align: center; flex: 1; }
      h2 {  margin: 0; }
      h3 { margin: 5px 0 0 0; font-weight: normal; font-size: 16px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      td, th { border: 1px solid #000; padding: 8px; text-align: left; }
      th { background-color: #f0f0f0; }
      button { padding: 8px 16px; background-color: #4CAF50; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
      button:hover { background-color: #45a049; }
    </style>
  </head>
  <body>
    <div class="header">
      <img style="width: 100px; height: 100px; margin-right: 20px;" src="/icon.jpg" alt="Logo" className="logo" />
      <div class="title">
        <h1>Jalaram Wiremesh</h1>
      </div>
    </div>

    <h2>Salary Slip - ${emp.employeeName}</h2>
    <h3>Month: ${month}</h3>

    <table>
      <tr><th>Total Salary</th><td>${emp.totalSalary}</td></tr>
      <tr><th>Present Days</th><td>${emp.presentDays}</td></tr>
      <tr><th>Absent Days</th><td>${emp.absentDays}</td></tr>
      <tr><th>Advance Given</th><td>${emp.advanceGiven}</td></tr>
      <tr><th>Loan Given</th><td>${emp.loanGiven}</td></tr>
      <tr><th>Loan Repaid</th><td>${emp.loanRepaid}</td></tr>
      <tr><th>Loan Left</th><td>${emp.loanLeft}</td></tr>
      <tr><th>Net Salary</th><td>${net.toFixed(2)}</td></tr>
    </table>
    <button onclick="window.print()">Print</button>
  </body>
</html>

  `);
  };


  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Monthly Report</h1>

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
          onClick={fetchReport}
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Employee</th>
              <th className="border px-3 py-2">Shift</th>
              <th className="border px-3 py-2">Basic</th>
              <th className="border px-3 py-2">HRA</th>
              <th className="border px-3 py-2">Other</th>
              <th className="border px-3 py-2">Allowances</th>
              <th className="border px-3 py-2">Total Salary</th>
              <th className="border px-3 py-2">Present Days</th>
              <th className="border px-3 py-2">Absent Days</th>
              <th className="border px-3 py-2">Advance Given</th>

              <th className="border px-3 py-2">Loan Given</th>
              <th className="border px-3 py-2">Loan Repaid</th>
              <th className="border px-3 py-2">Loan Left</th>
              <th className="border px-3 py-2">Net Salary</th>
              <th className="border px-3 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {report.map((emp, idx) => (
              <>
                <tr key={idx}>
                  <td className="border px-3 py-2 font-semibold">{emp.employeeName}</td>
                  <td className="border px-3 py-2 text-center">{emp.shift}</td>
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
                  <td className={`border px-3 py-2 font-bold text-right ${calculateNet(emp) < 0 ? "text-red-600" : calculateNet(emp) > 0 ? "text-green-600" : "text-gray-600"}`}>
                    {calculateNet(emp)}
                  </td>

                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handlePrint(emp)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Print
                    </button>
                  </td>

                </tr>


              </>
            ))}
          </tbody>

        </table>
        
      </div>

      
    </div>
  );
}
