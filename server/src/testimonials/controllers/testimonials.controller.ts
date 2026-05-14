import type { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import * as service from "../services/testimonials.service";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    handleError(res, error, 500, "TESTIMONIALS");
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quote, name, role } = req.body;
    if (!quote?.trim() || !name?.trim()) {
      res.status(400).json({ message: "ציטוט ושם הם שדות חובה" });
      return;
    }
    const item = await service.create(String(quote).trim(), String(name).trim(), String(role ?? "").trim());
    res.status(201).json(item);
  } catch (error) {
    handleError(res, error, 500, "TESTIMONIALS");
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { quote, name, role } = req.body;
    if (!quote?.trim() || !name?.trim()) {
      res.status(400).json({ message: "ציטוט ושם הם שדות חובה" });
      return;
    }
    const item = await service.update(
      String(req.params.id),
      String(quote).trim(),
      String(name).trim(),
      String(role ?? "").trim(),
    );
    if (!item) { res.status(404).json({ message: "לא נמצא" }); return; }
    res.json(item);
  } catch (error) {
    handleError(res, error, 500, "TESTIMONIALS");
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await service.remove(String(req.params.id));
    res.json({ message: "נמחק" });
  } catch (error) {
    handleError(res, error, 500, "TESTIMONIALS");
  }
};
