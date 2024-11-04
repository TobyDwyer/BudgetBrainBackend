import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import { authenticateToken } from "../middleware/auth.mjs";
import Transaction from "../models/Transaction.mjs";

const router = express.Router();

router.post('/login',async  (req, res) =>  {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("User not found.");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials.");
    }
    
    if (user) {

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } else {
        res.send('Invalid email or password');
    }
});


router.post('/delete-account', authenticateToken, async (req, res) => {
    
    const user = await User.findOne({ _id: req.user.id });

    User.deleteOne({ _id: user._id })
});

export default router;
