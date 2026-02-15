import { Schema, model, Document } from "mongoose";

const talleValues = ["S", "M", "L", "XL", "XXL"] as const;

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  talle: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  talle: { type: [String], required: true, enum: talleValues },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  versionKey: false
});

export const Product = model<IProduct>("Product", productSchema);