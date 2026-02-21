import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import connectDB from "../config/mongodb";
import { User } from "../models/user.model";

dotenv.config()

const createAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = "Super Admin"

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL o ADMIN_PASSWORD, no se encuentran definidos")
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️ El admin ya existe");
      process.exit(0)
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      name,
      role: "ADMIN",
      isActive: true
    });

    console.log("✅ Admin creado correctamente")
    console.log(`📧 Email ${email}`)
    console.log(`🔑 Password ${password}`)

    process.exit(0);
  } catch (error) {
    console.error("🔥 Error creando el Admin", error);
    process.exit(1);
  }
};

createAdmin()