import type { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import * as service from "../services/game-items.service";

export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getByType(String(req.params.gameType)));
  } catch (error) {
    handleError(res, error, 500, "GAME_ITEMS");
  }
};

export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await service.create(String(req.params.gameType), req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(res, error, 500, "GAME_ITEMS");
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    await service.remove(String(req.params.id));
    res.json({ message: "נמחק" });
  } catch (error) {
    handleError(res, error, 500, "GAME_ITEMS");
  }
};
