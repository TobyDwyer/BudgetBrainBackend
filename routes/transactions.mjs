import express from "express";
import Transaction from "../models/Transaction.mjs";
import { authenticateToken } from "../middleware/auth.mjs";

const router = express.Router();

// Create Transaction
router.post("/", authenticateToken, async (req, res) => {
  const { _id, ...transactionData } = req.body.transaction;

  try {
    let transaction = await Transaction.findById(_id)

    if (!transaction) {
      transaction = await Transaction.create({
        _id : _id,
        ...transactionData,
        userId: req.user.id, 
        remainingAmount: transactionData.remainingAmount || 0, 
      });
    }else{
      Object.assign(transaction, transactionData);
      transaction.save()
    }
    // budget = await Budget.findById(budget._id);
    console.log('transaction', {
      id : transaction._id,
      userId: transaction.userId,
      created : transaction.createdAt
    });
    
    res.status(201).json({ transaction: transaction });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send("Validation Error: " + err.message);
    }
    res.status(500).send("Error writing budget: " + err.message);
  }
});

// Get Transactions
router.get("/", authenticateToken, async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id });
  res.json({transactions:transactions});
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

export default router;
