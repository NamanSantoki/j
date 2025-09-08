import mongoose from "mongoose";

const loanAdvanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  type: { type: String, enum: ["Loan", "RepaidLoan", "Advance"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("LoanAdvance", loanAdvanceSchema);
  