import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || "9000";
export const CORS_WHITE_LIST = process.env.CORS_WHITE_LIST || "[]";
export const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "";
export const POSTGRES_CONNECTION_STRING =
  process.env.POSTGRES_CONNECTION_STRING || "";
export const SITE_URL = process.env.SITE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || "";
