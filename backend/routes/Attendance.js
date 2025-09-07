import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Save or update attendance
router.post("/", async (req, res) => {
  try {
    const { month, attendance } = req.body;

    if (!month || !attendance) return res.status(400).json({ message: "Missing fields" });

    // For each employee, save or update attendance
    const promises = Object.keys(attendance).map(async (empId) => {
      const existing = await Attendance.findOne({ employeeId: empId, month });
      if (existing) {
        existing.attendance = attendance[empId];
        await existing.save();
      } else {
        const newAtt = new Attendance({ employeeId: empId, month, attendance: attendance[empId] });
        await newAtt.save();
      }
    });

    await Promise.all(promises);

    res.json({ message: "Attendance saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get attendance for a month
router.get("/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const data = await Attendance.find({ month }).populate("employeeId");
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
