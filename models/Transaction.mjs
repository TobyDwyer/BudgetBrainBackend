import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  budgetId: {
    type: String,
    ref: "Budget",
    required: true,
  },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
