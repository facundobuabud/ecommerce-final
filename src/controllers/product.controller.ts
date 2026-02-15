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
    const products = await Product.find({ isActive: true });
    return res.status(200).json({ success: true, products });

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