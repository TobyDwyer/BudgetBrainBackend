const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  languagePreference: { type: String, default: "en" },
  savingsGoal: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
