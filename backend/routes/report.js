import express from "express";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import LoanAdvance from "../models/LoanAdvance.js";
import ExtraHours from "../models/ExtraHours.js";

const router = express.Router();

// GET /api/report?month=YYYY-MM
router.get("/", async (req, res) => {
  const { month } = req.query;

  try {
    const employees = await Employee.find();

    const reportData = await Promise.all(
      employees.map(async (emp) => {
        // Attendance
        const attendanceRecord = await Attendance.findOne({
          employeeId: emp._id,
          month,
        });

        let presentDays = 0;
        let absentDays = 0;
        const attendanceDetails = [];

        if (attendanceRecord) {
          for (const [day, status] of attendanceRecord.attendance.entries()) {
            if (status === "P") presentDays++;
            if (status === "A") absentDays++;
            attendanceDetails.push({ date: day, status });
          }
        }

        // Loan & Advance
        const loans = await LoanAdvance.find({ employeeId: emp._id });
        let advanceGiven = 0;
        let loanGiven = 0;
        let loanRepaid = 0;

        loans.forEach((l) => {
          if (l.type === "Advance") advanceGiven += l.amount;
          if (l.type === "Loan") loanGiven += l.amount;
          if (l.type === "RepaidLoan") loanRepaid += l.amount;
        });

        const loanLeft = loanGiven - loanRepaid;

        // Extra Hours
        const extraHours = await ExtraHours.find({ employee: emp._id, month });
        let totalExtra = 0;
        extraHours.forEach((eh) => {
          totalExtra += (eh.extra || 0) - (eh.late || 0);
        });

        // Total Salary
        const basic = emp.salaryBreakup.basic || 0;
        const hra = emp.salaryBreakup.hra || 0;
        const conveyance = emp.salaryBreakup.conveyance || 0;
        const others = emp.salaryBreakup.others || 0;

        

        const totalSalary = basic + hra + conveyance+others;
        const netSalary = totalSalary - advanceGiven;
        return {
          _id: emp._id,
          employeeName: emp.name,
          shift: emp.shift,
          basic,
          hra,
          conveyance,
          others,
          totalSalary,
          presentDays,
          absentDays,
          advanceGiven,
          loanGiven,
          loanRepaid,
          loanLeft,
          netSalary,
          attendance: attendanceDetails,
        };
      })
    );

    res.json(reportData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching report", error: err.message });
  }
});

export default router;
