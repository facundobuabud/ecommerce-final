import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { registerUserSchema, loginUserSchema } from "../validators/user.validator";
import validateSchema from "../middleware/validateSchema";

const router = Router()

router.post("/register", validateSchema(registerUserSchema), registerUser);

router.post("/login", validateSchema(loginUserSchema), loginUser);

export default router