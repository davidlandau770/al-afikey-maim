import type { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import * as service from "../services/products.service";
import { uploadToCloudinary, deleteFromCloudinary } from "../../helpers/cloudinary";

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
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
    const [imageUrl, ...extraUrls] = await Promise.all([
      mainImageFile ? uploadToCloudinary(mainImageFile.buffer) : Promise.resolve(undefined),
      ...extraImageFiles.map(f => uploadToCloudinary(f.buffer)),
    ]);
    const product = await service.create({
      name,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      featured: featured === "true" || featured === true,
      pages: pages ? Number(pages) : undefined,
      image: imageUrl,
      images: extraUrls.filter(Boolean) as string[],
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
    const [newImageUrl, ...newExtraUrls] = await Promise.all([
      mainImageFile ? uploadToCloudinary(mainImageFile.buffer) : Promise.resolve(undefined),
      ...extraImageFiles.map(f => uploadToCloudinary(f.buffer)),
    ]);
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
      image: newImageUrl ?? (existingImage ?? undefined),
      images: [...keptImages, ...(newExtraUrls.filter(Boolean) as string[])],
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
    const deleted = await service.remove(id);
    if (!deleted) throw new CustomError("מוצר לא נמצא", 404, "PRODUCTS");
    const urls = [deleted.image, ...(deleted.images ?? [])].filter(Boolean) as string[];
    await Promise.allSettled(urls.map(deleteFromCloudinary));
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (error) {
    handleError(res, error, 500, "PRODUCTS");
  }
};
