import mongoose from "mongoose";

const extraHoursSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  },
  late: {
    type: Number,
    default: 0,
  },
  extra: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    required: true,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    },
  },
});

export default mongoose.model("ExtraHours", extraHoursSchema);
