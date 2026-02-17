import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error.format() });
    }

    req.body = result.data;
    next();
  }

export default validateSchema;