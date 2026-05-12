import type { Request, Response } from "express";
import { handleError, CustomError } from "../../utils/handleError";
import * as service from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "שם משתמש וסיסמה חובה" });
      return;
    }
    const result = await service.login(String(username), String(password));
    res.json(result);
  } catch (error) {
    handleError(res, error, 401, "AUTH");
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || String(newPassword).length < 6) {
      res.status(400).json({ message: "סיסמה חייבת להכיל לפחות 6 תווים" });
      return;
    }
    await service.changePassword(req.user!.username, String(newPassword));
    res.json({ message: "הסיסמה שונתה בהצלחה" });
  } catch (error) {
    handleError(res, error, 500, "AUTH");
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await service.getAll(req.user?.role === 'owner'));
  } catch (error) {
    handleError(res, error, 500, "AUTH");
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, phone, email } = req.body;
    if (!username?.trim() || !password || String(password).length < 6) {
      res.status(400).json({ message: "שם משתמש וסיסמה (לפחות 6 תווים) חובה" });
      return;
    }
    const user = await service.createUser(
      String(username).trim(),
      String(password),
      phone ? String(phone).trim() : undefined,
      email ? String(email).trim() : undefined,
    );
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 400, "AUTH");
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || String(newPassword).length < 6) {
      res.status(400).json({ message: "סיסמה חייבת להכיל לפחות 6 תווים" });
      return;
    }
    await service.resetPassword(String(req.params.id), String(newPassword));
    res.json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (error) {
    handleError(res, error, 500, "AUTH");
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, email } = req.body;
    const user = await service.updateUser(
      String(req.params.id),
      phone ? String(phone).trim() : undefined,
      email ? String(email).trim() : undefined,
    );
    if (!user) throw new CustomError("משתמש לא נמצא", 404, "AUTH");
    res.json(user);
  } catch (error) {
    handleError(res, error, 500, "AUTH");
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await service.deleteUser(String(req.params.id));
    if (!deleted) throw new CustomError("משתמש לא נמצא או שלא ניתן למחוק בעלים", 400, "AUTH");
    res.json({ message: "המשתמש נמחק" });
  } catch (error) {
    handleError(res, error, 500, "AUTH");
  }
};
