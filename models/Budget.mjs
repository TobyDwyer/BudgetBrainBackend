import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budgetedAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  // categories: [
  //   {
  //     category: { type: String, required: true },
  //     amount: { type: Number, required: true },
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
});
BudgetSchema.index({ userId: 1 });

export default mongoose.model("Budget", BudgetSchema);
