import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IPayload } from "../interfaces/jwt.interface";
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No autorizado: token no enviado" })
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No autorizado: token invalido" })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as IPayload

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "No autorizado: token invalido o expirado" })
  }
}