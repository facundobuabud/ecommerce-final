import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, restoreProduct } from "../controllers/product.controller";
import { validateSchema } from "../middleware/validateSchema";
import { productSchema, productSchemaPartial } from "../validators/product.validator";

const productRoutes = Router()

productRoutes.post("/", validateSchema(productSchema), createProduct)

productRoutes.get("/", getProducts)

productRoutes.patch("/:id", validateSchema(productSchemaPartial), updateProduct)

productRoutes.delete("/:id", deleteProduct)

productRoutes.patch("/:id/restore", restoreProduct)

export default productRoutes