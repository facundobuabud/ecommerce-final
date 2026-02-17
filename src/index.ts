import express from "express";
import connectDB from "./config/mongodb";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/porduct.routes";
import authRoutes from "./routes/auth.routes"
import { authMiddleware } from "./middleware/auth.middleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", authMiddleware, productRoutes)

app.use("/auth", authRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, error: "El recusro no se encuentra" })
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  try {
    console.log(`🚀 Server is running on port`);
    connectDB();
  } catch (error) {
    const err = error as Error
    console.log(err.message)
    process.exit(1)
  }
})
