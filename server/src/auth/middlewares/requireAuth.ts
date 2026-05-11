import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../helpers/environments";

export interface AuthUser {
  username: string;
  role: "owner" | "admin";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ message: "לא מורשה" });
    return;
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "טוקן לא תקין או פג תוקף" });
  }
};

export const requireOwner = (req: Request, res: Response, next: NextFunction): void => {
  requireAuth(req, res, () => {
    if (req.user?.role !== "owner") {
      res.status(403).json({ message: "נדרשות הרשאות בעלים" });
      return;
    }
    next();
  });
};
