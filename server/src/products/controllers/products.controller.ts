import type { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import * as service from "../services/products.service";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error, 500, "PRODUCTS");
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, originalPrice, category, featured, pages } = req.body;
    if (!name || !description || !price || !category) {
      throw new CustomError("שדות חובה חסרים", 400, "PRODUCTS");
    }
    const { soldOut, stock } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const mainImageFile = files?.image?.[0];
    const extraImageFiles = files?.images ?? [];
    const product = await service.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      featured: featured === "true" || featured === true,
      pages: pages ? Number(pages) : undefined,
      image: mainImageFile ? `/images/${mainImageFile.filename}` : undefined,
      images: extraImageFiles.map(f => `/images/${f.filename}`),
      soldOut: soldOut === "true" || soldOut === true,
      stock: stock !== undefined && stock !== "" ? Number(stock) : undefined,
    });
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error, 500, "PRODUCTS");
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { name, description, price, originalPrice, category, featured, pages, existingImage, existingImages, soldOut, stock } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const mainImageFile = files?.image?.[0];
    const extraImageFiles = files?.images ?? [];
    const newExtraImages = extraImageFiles.map(f => `/images/${f.filename}`);
    const keptImages: string[] = existingImages
      ? (Array.isArray(existingImages) ? existingImages : [existingImages])
      : [];
    const updated = await service.update(id, {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      ...(category && { category }),
      featured: featured === "true" || featured === true,
      ...(pages && { pages: Number(pages) }),
      image: mainImageFile ? `/images/${mainImageFile.filename}` : (existingImage ?? undefined),
      images: [...keptImages, ...newExtraImages],
      soldOut: soldOut === "true" || soldOut === true,
      stock: stock !== undefined && stock !== "" ? Number(stock) : undefined,
    });
    if (!updated) throw new CustomError("מוצר לא נמצא", 404, "PRODUCTS");
    res.json(updated);
  } catch (error) {
    handleError(res, error, 500, "PRODUCTS");
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    if (!(await service.remove(id))) throw new CustomError("מוצר לא נמצא", 404, "PRODUCTS");
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (error) {
    handleError(res, error, 500, "PRODUCTS");
  }
};
