import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const orderRoutes = Router()

orderRoutes.post("/", authMiddleware, createOrder)

orderRoutes.get("/my-orders", authMiddleware, getMyOrders)

orderRoutes.get("/:id", authMiddleware, getOrderById)

orderRoutes.get("/", authMiddleware, isAdmin, getAllOrders)

orderRoutes.patch("/:id/status", authMiddleware, isAdmin, updateOrderStatus)

orderRoutes.delete("/:id", authMiddleware, cancelOrder)

export default orderRoutes