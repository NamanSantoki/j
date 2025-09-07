import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift: { type: String, default: "8-hour" },
  salaryBreakup: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
  }
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
