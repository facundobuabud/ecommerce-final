import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, restoreProduct } from "../controllers/product.controller";
import { validateSchema } from "../middleware/validateSchema";
import { productSchema, productSchemaPartial } from "../validators/product.validator";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const productRoutes = Router()

productRoutes.post("/", authMiddleware, isAdmin, validateSchema(productSchema), createProduct)

productRoutes.get("/", getProducts)

productRoutes.patch("/:id", authMiddleware, isAdmin, validateSchema(productSchemaPartial), updateProduct)

productRoutes.delete("/:id", authMiddleware, isAdmin, deleteProduct)

productRoutes.patch("/:id/restore", authMiddleware, isAdmin, restoreProduct)

export default productRoutes