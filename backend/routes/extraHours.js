import express from "express";
import ExtraHours from "../models/ExtraHours.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// ➕ Add extra/late hours
router.post("/", async (req, res) => {
  try {
    const { employeeId, late, extra } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const total = (extra || 0) - (late || 0);

    const record = new ExtraHours({
      employee: employeeId,
      late,
      extra,
      total,
    });

    await record.save();
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📂 Get all records
router.get("/", async (req, res) => {
  try {
    const records = await ExtraHours.find().populate("employee", "name");
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ❌ Delete record
router.delete("/:id", async (req, res) => {
  try {
    const record = await ExtraHours.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json({ message: "Record deleted successfully", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
