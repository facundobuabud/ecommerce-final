import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email invalido" }).toLowerCase(),
  password: z.string().min(7, { message: "La contraseña debe tener al menos 7 caracteres" }).max(20)
})

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Email invalido" }).toLowerCase(),
  password: z.string().min(1, { message: "La contraseña es requerida" })
})

export type registerValidate = z.infer<typeof registerUserSchema>
export type loginValidate = z.infer<typeof loginUserSchema>