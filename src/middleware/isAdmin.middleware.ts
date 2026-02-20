import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "No autenticado" })
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "No tenes permiso para esta accion" })
  }

  next()
}