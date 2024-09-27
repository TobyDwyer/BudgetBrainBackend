const express = require("express");
const Transaction = require("../models/Transaction");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Create Transaction
router.post("/", authenticateToken, async (req, res) => {
  const transaction = new Transaction({ userId: req.user.id, ...req.body });

  try {
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).send("Error creating transaction: " + err.message);
  }
});

// Get Transactions
router.get("/", authenticateToken, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id });
  res.json(transactions);
});

// Delete Transaction
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).send("Error deleting transaction: " + err.message);
  }
});

module.exports = router;
