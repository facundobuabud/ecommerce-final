import { User } from "../models/user.model";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { registerValidate, loginValidate } from "../validators/user.validator";
import { IPayload } from "../interfaces/jwt.interface";
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no esta definido")
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const data: registerValidate = req.body;

    const { email, name } = data

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "El email ya esta registrado" })
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10)

    const newDataUser = {
      email,
      password: hashedPassword,
      name,
      role: "USER"
    }

    const newUser = await User.create(newDataUser);

    return res.status(201).json({
      success: true, data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al resgistrar al usuario" })
  }
}

export const loginUser = async (req: Request, res: Response) => {

  try {
    const data: loginValidate = req.body
    const { email, password } = data;

    const foundUser = await User.findOne({ email }).select("+password");

    if (!foundUser) {
      return res.status(401).json({ success: false, message: "Credenciales invalidas" })
    }

    const isPasswordValid = await bcryptjs.compare(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Credenciales invalidas" })
    }

    const payload: IPayload = {
      id: foundUser._id.toString(),
      role: foundUser.role
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" })

    return res.status(200).json({
      success: true, token, user: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al iniciar sesion" })
  }


}