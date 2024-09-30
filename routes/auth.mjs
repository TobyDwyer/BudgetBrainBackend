import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.mjs"


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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ 
      token: token,
    })
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
  }catch{
    return res.status(401).send("Invalid credentials.");
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials.");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ 
    token: token,
   });
});

router.post("/user", async (req, res) => {
  res.json({ 
    user: req.user,
   });
});

export default router;
