import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce-final";
console.log("🔍 Connecting to MongoDB...");

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI no esta definido");
}

export const connectDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
