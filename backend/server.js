import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import budgetRoutes from "./routes/budgetRoutes.js";





dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://fin-pilot-six.vercel.app",
  credentials: true
}));
app.use("/api/auth" , authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);


app.use("/api/budget", budgetRoutes);
//app.use("/api/ai", aiRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});