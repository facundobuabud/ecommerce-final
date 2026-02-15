import { z } from "zod";

export const talleEnum = z.enum(["S", "M", "L", "XL", "XXL"]);

export const productSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).max(50, { message: "El nombre debe tener menos de 50 caracteres" }),
  description: z.string().min(1),
  price: z.number().positive({ message: "El precio debe ser un número positivo" }),
  stock: z.number().int({ message: "El stock debe ser un número entero" }).nonnegative({ message: "El stock no puede ser negativo" }),
  category: z.string().min(1, "La categoría es requerida"),
  brand: z.string().min(1),
  talle: z.array(talleEnum).min(1, { message: "Debe tener al menos un telle" }),
});

export const productSchemaPartial = productSchema.partial();

export type productValidate = z.infer<typeof productSchema>;
export type productValidatePartial = z.infer<typeof productSchemaPartial>;