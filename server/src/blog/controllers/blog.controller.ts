import type { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import * as service from "../services/blog.service";
import { uploadToCloudinary, deleteFromCloudinary, FOLDERS } from "../../helpers/cloudinary";

export const getPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error, 500, "BLOG");
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await service.getById(String(req.params.id));
    if (!post) throw new CustomError("כתבה לא נמצאה", 404, "BLOG");
    res.json(post);
  } catch (error) {
    handleError(res, error, 500, "BLOG");
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!title || !content) throw new CustomError("כותרת ותוכן חובה", 400, "BLOG");
    const file = (req.file as Express.Multer.File | undefined);
    const image = file ? await uploadToCloudinary(file.buffer, FOLDERS.blog) : undefined;
    const post = await service.create({ title, content, image });
    res.status(201).json(post);
  } catch (error) {
    handleError(res, error, 500, "BLOG");
  }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { title, content, existingImage } = req.body;
    const file = (req.file as Express.Multer.File | undefined);
    const newImage = file ? await uploadToCloudinary(file.buffer, FOLDERS.blog) : undefined;
    const updated = await service.update(id, {
      ...(title && { title }),
      ...(content && { content }),
      image: newImage ?? (existingImage || undefined),
    });
    if (!updated) throw new CustomError("כתבה לא נמצאה", 404, "BLOG");
    res.json(updated);
  } catch (error) {
    handleError(res, error, 500, "BLOG");
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await service.remove(id);
    if (!deleted) throw new CustomError("כתבה לא נמצאה", 404, "BLOG");
    if (deleted.image) await deleteFromCloudinary(deleted.image).catch(() => null);
    res.json({ message: "הכתבה נמחקה" });
  } catch (error) {
    handleError(res, error, 500, "BLOG");
  }
};