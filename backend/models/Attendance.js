import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  month: { type: String, required: true }, // Format: YYYY-MM
  attendance: { type: Map, of: String, required: true }, // day number -> "P"/"A"/"H"
});

AttendanceSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
