import express from "express"
import Budget from "../models/Budget.mjs"
import { authenticateToken } from "../middleware/auth.mjs"

const router = express.Router();

// Create Budget
router.post("/", authenticateToken, async (req, res) => {
  const budget = new Budget({ userId: req.user.id, ...req.body });

  try {
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).send("Error creating budget: " + err.message);
  }
});

// Get Budgets
router.get("/", authenticateToken, async (req, res) => {
  const budgets = await Budget.find({ userId: req.user.id });
  res.json(budgets);
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

export default router;
