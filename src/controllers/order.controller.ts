import { Request, Response } from "express"
import { Order } from "../models/order.model"
import { Product } from "../models/product.model"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "La orden debe tener al menos un producto"
      })
    }

    const productIds = items.map((item: any) => item.product)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })

    if (products.length !== items.length) {
      return res.status(404).json({
        success: false,
        error: "Uno o más productos no fueron encontrados o están inactivos"
      })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product)!

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${product.name}`
        })
      }

      const subtotal = product.price * item.quantity
      total += subtotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      })
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      })
    }

    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      total,
      status: "PENDING"
    })

    res.status(201).json({
      success: true,
      data: newOrder
    })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price")

    res.json({
      success: true,
      data: orders
    })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user!

    const order = await Order.findById(id)
      .populate("items.product", "name price")

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada"
      })
    }

    if (user.role !== "ADMIN" && order.user.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        error: "No tenés permisos para ver esta orden"
      })
    }

    res.json({ success: true, data: order })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")

    res.json({
      success: true,
      data: orders
    })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Estado no válido"
      })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada"
      })
    }

    order.status = status
    await order.save()

    res.json({
      success: true,
      data: order
    })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = req.user!

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Orden no encontrada"
      })
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        error: "No podés cancelar esta orden"
      })
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        error: "Solo se pueden cancelar órdenes pendientes"
      })
    }

    // Devolvemos el stock de cada producto
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      })
    }

    order.status = "CANCELLED"
    await order.save()

    res.json({
      success: true,
      message: "Orden cancelada correctamente"
    })

  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}