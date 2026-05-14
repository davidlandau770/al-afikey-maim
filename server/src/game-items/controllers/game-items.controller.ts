import type { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import * as service from "../services/game-items.service";
import { uploadToCloudinary, deleteFromCloudinary, FOLDERS } from "../../helpers/cloudinary";

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

export const createNikudMatchItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { letter, nikud, word } = req.body;
    if (!letter?.trim() || !nikud || !word?.trim() || !req.file) {
      res.status(400).json({ message: "כל השדות חובה" });
      return;
    }
    if (!["kamatz", "patach"].includes(String(nikud))) {
      res.status(400).json({ message: "ניקוד לא תקין" });
      return;
    }
    const imageUrl = await uploadToCloudinary(req.file.buffer, FOLDERS.games);
    const item = await service.create("nikud_match", {
      letter: String(letter).trim(),
      nikud: String(nikud),
      imageUrl,
      word: String(word).trim(),
    });
    res.status(201).json(item);
  } catch (error) {
    handleError(res, error, 500, "GAME_ITEMS");
  }
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await service.getById(String(req.params.id));
    if (item?.gameType === "nikud_match" && item.data?.imageUrl) {
      await deleteFromCloudinary(item.data.imageUrl).catch(() => {});
    }
    await service.remove(String(req.params.id));
    res.json({ message: "נמחק" });
  } catch (error) {
    handleError(res, error, 500, "GAME_ITEMS");
  }
};