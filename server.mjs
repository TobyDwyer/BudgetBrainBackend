import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import budgetRoutes from "./routes/budgets.mjs"
import transactionRoutes from "./routes/transactions.mjs"
import authRoutes from "./routes/auth.mjs";
import homeRoutes from "./routes/home.mjs";
import path, { dirname } from "path"
import { fileURLToPath } from "url"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2323;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://BudgetBrainAdmin:BudgetBrainAdmin@budgetbrain.tpaxw.mongodb.net/?retryWrites=true&w=majority&appName=BudgetBrain")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/", homeRoutes);

app.use(express.static(path.join(__dirname, 'public')));



let server = http.createServer({}, app)
console.log("Server listing on: http://localhost:" + PORT);
try {
    server.listen(PORT)
} catch (error) {
    console.log(error);
    
}

