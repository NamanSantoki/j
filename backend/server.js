import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import attendanceRoutes from "./routes/Attendance.js";
import employeeRoutes from "./routes/employees.js";
import loanAdvanceRoutes from "./routes/loanAdvance.js";
import extraHoursRoutes from "./routes/extraHours.js";
import reportRoutes from "./routes/report.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/loan-advance", loanAdvanceRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/extra-hours", extraHoursRoutes);
app.use("/api/report", reportRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
