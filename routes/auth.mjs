import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import Transaction from "../models/Transaction.mjs";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    languagePreference,
    savingsGoal,
  } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    password: hashedPassword,
    languagePreference,
    savingsGoal,
  });

  try {
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      token: token,
    });
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("User not found.");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error.");
  }
});

router.post("/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(401).send("User not found.");
    }
    user.password = undefined;
    res.json({
      user: user,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error.");
  }
});



router.put("/update", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(401).send("User not found.");
    }

    const userData = req.body
    
    Object.assign(user, userData)
    user.save()

    res.json(user);
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error.");
  }
});

router.post("/dashboard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    if (!user) {
      return res.status(401).send("User not found.");
    }

    const txns = await Transaction.find({
      userId: req.user.id,
      category: "Savings",
    });

    const saved = txns.reduce((sum, val) => {
      return sum + val.amount;
    }, 0);

    const pres = Math.round(Math.min(saved / user.savingsGoal, 1) * 100);

    res.json({
      presentageSaved: pres,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Internal server error.");
  }
});

export default router;
