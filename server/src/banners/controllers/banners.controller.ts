import type { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import * as service from "../services/banners.service";

export const getBanners = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error, 500, "BANNERS");
  }
};

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, text, bannerLink, link, linkText, bgColor, bgImage, imageHeight, position, active } = req.body;
    const banner = await service.create({
      title: title ?? '',
      text: text || undefined,
      bannerLink: bannerLink || undefined,
      link: link || undefined,
      linkText: linkText || undefined,
      bgColor: bgColor ?? "#1B6B8A",
      bgImage: bgImage || undefined,
      imageHeight: imageHeight ? Number(imageHeight) : undefined,
      position: Number(position ?? 0),
      active: active === true || active === "true",
    });
    res.status(201).json(banner);
  } catch (error) {
    handleError(res, error, 500, "BANNERS");
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { title, text, bannerLink, link, linkText, bgColor, bgImage, imageHeight, position, active } = req.body;
    const updated = await service.update(id, {
      ...(title !== undefined && { title }),
      text: text || undefined,
      ...("bannerLink" in req.body && { bannerLink: bannerLink || undefined }),
      link: link || undefined,
      linkText: linkText || undefined,
      ...(bgColor !== undefined && { bgColor }),
      ...("bgImage" in req.body && { bgImage: bgImage || undefined }),
      ...("imageHeight" in req.body && { imageHeight: imageHeight ? Number(imageHeight) : undefined }),
      ...(position !== undefined && { position: Number(position) }),
      ...(active !== undefined && { active: active === true || active === "true" }),
    });
    if (!updated) throw new CustomError("באנר לא נמצא", 404, "BANNERS");
    res.json(updated);
  } catch (error) {
    handleError(res, error, 500, "BANNERS");
  }
};

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    if (!(await service.remove(id))) throw new CustomError("באנר לא נמצא", 404, "BANNERS");
    res.json({ message: "הבאנר נמחק" });
  } catch (error) {
    handleError(res, error, 500, "BANNERS");
  }
};
