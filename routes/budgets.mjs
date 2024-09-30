import express from "express";
import Budget from "../models/Budget.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import Transaction from "../models/Transaction.mjs";

const router = express.Router();

// Get Budgets
router.get("/", authenticateToken, async (req, res) => {
  const budgets = await Budget.find({ userId: req.user.id });
  res.json({ budgets: budgets });
});

// Budget Details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id });

    await budget.categories.forEach(async (x) => {
      const txns = await Transaction.find({
        budgetId: budget._id,
        category: x.category,
      });
      x.amountSpent = txns.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    });

    res.status(200).json({ budget: budget });
  } catch (err) {
    res.status(400).send("Error Getting budget: " + err.message);
  }
});

// Create Budget
router.post("/", authenticateToken, async (req, res) => {
  const budget = new Budget({
    userId: req.user.id,
    ...req.body,
    remainingAmount: 0,
  });

  try {
    await budget.save();
    res.status(201).json({ budget: budget });
  } catch (err) {
    res.status(400).send("Error creating budget: " + err.message);
  }
});

// Delete Budget
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).send("Error deleting budget: " + err.message);
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ budget: budget });
  } catch (err) {
    res.status(400).send("Error updating budget: " + err.message);
  }
});

export default router;
