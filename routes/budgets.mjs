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
  const { _id, ...budgetData } = req.body.budget; // Destructure the request body

  // Validate incoming budget data
  // const { error } = validateBudget(budgetData); // Assume validateBudget is defined as before
  // if (error) return res.status(400).send(error.details[0].message);

  try {
    let budget = await Budget.findById(_id)

    if (!budget) {
      budget = await Budget.create({
        _id : _id,
        ...budgetData,
        userId: req.user.id, // Include the userId when creating
        remainingAmount: budgetData.remainingAmount || 0, // Default remainingAmount to 0
      });
    }else{
      Object.assign(budget, budgetData);
      budget.save()
    }
    // budget = await Budget.findById(budget._id);
    console.log('budget', {
      id : budget._id,
      userId: budget.userId,
      created : budget.createdAt
    });
    
    res.status(201).json({ budget });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send("Validation Error: " + err.message);
    }
    res.status(500).send("Error writing budget: " + err.message);
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
