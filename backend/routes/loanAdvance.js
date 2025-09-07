import express from "express";
import LoanAdvance from "../models/LoanAdvance.js";

const router = express.Router();

// Add new Loan / Advance / RepaidLoan
router.post("/", async (req, res) => {
  try {
    const { employeeId, type, amount } = req.body;
    if (!employeeId || !type || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const entry = new LoanAdvance({ employeeId, type, amount });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all entries for an employee
router.get("/:employeeId", async (req, res) => {
  try {
    const entries = await LoanAdvance.find({ employeeId: req.params.employeeId }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedEntry = await LoanAdvance.findByIdAndDelete(req.params.id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json({ message: "Entry deleted successfully", deletedEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
