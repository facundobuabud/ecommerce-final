import { Request, Response } from "express";
import { productValidate, productValidatePartial } from "../validators/product.validator";
import { Product } from "../models/product.model";




export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: productValidate = req.body;
    const product = await Product.create(productData);

    if (!product) {

      return res.status(400).json({ success: false, message: "Error al crear el producto" });

    }

    res.status(201).json({ success: true, product });

  } catch (error) {

    return res.status(500).json({ success: false, message: "Error al crear el producto" });
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, category, brand, search, sortBy, order, page, limit } = req.query;

    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortField = (sortBy as string) || "createdAt";

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(filter)

    const products = await Product.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(pageSize);

    return res.status(200).json({ success: true, total, page: pageNumber, totalPages: Math.ceil(total / pageSize), products });

  } catch (error) {

    return res.status(500).json({ success: false, message: "Error al obtener los productos" });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productData: productValidatePartial = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id, isActive: true },
      productData,
      { new: true });

    if (!updatedProduct) {

      return res.status(404).json({ success: false, message: "Producto no encontrado o no activo" });
    }

    return res.status(200).json({ success: true, data: updatedProduct });

  } catch (error) {

    return res.status(500).json({ success: false, message: "Error al actualizar el producto" });
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id, isActive: true },
      { isActive: false },
      { new: true }
    )

    if (!deletedProduct) {
      return res.status(400).json({ success: false, message: "Producto no encontrado o ya eliminado" })
    }

    return res.status(200).json({ success: true, data: deletedProduct })

  } catch (error) {

    return res.status(500).json({ success: false, message: "Error al borrar el producto" })

  };
}

export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const restoredProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, isActive: false },
      { isActive: true },
      { new: true }
    )

    if (!restoredProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado o ya activado" })
    }

    return res.status(200).json({ success: true, data: restoredProduct })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error al restaurar el producto" })
  }
}

export default {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  restoreProduct
}