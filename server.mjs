import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import budgetRoutes from "./routes/budgets.mjs"
import transactionRoutes from "./routes/transactions.mjs"
import authRoutes from "./routes/auth.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2323;

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

app.use((reg, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

app.use("/api/auth", authRoutes);
app.route("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.route("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.route("/api/transactions", transactionRoutes);

let server = http.createServer({}, app)
console.log("Server listing on: http://localhost:" + PORT);
try {
    server.listen(PORT)
} catch (error) {
    console.log(error);
    
}

