import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../db";
import { JWT_SECRET } from "../../helpers/environments";

export interface AdminUser {
  id: string;
  username: string;
  role: "owner" | "admin";
  phone?: string;
  email?: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toUser = (row: any): AdminUser => ({
  id: row.id,
  username: row.username,
  role: row.role,
  phone: row.phone ?? undefined,
  email: row.email ?? undefined,
  createdAt: row.created_at,
});

export const login = async (username: string, password: string): Promise<{ token: string; role: string; username: string }> => {
  const { rows } = await pool.query(
    "SELECT password_hash, role FROM admin_users WHERE username = $1",
    [username],
  );
  if (rows.length === 0) throw new Error("שם משתמש או סיסמה שגויים");

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) throw new Error("שם משתמש או סיסמה שגויים");

  const role: string = rows[0].role;
  const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: "4h" });
  return { token, role, username };
};

export const changePassword = async (username: string, newPassword: string): Promise<void> => {
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE username = $2", [hash, username]);
};

export const getAll = async (includeOwner: boolean): Promise<AdminUser[]> => {
  const { rows } = await pool.query(
    includeOwner
      ? "SELECT id, username, role, created_at FROM admin_users ORDER BY created_at ASC"
      : "SELECT id, username, role, created_at FROM admin_users WHERE role != 'owner' ORDER BY created_at ASC",
  );
  return rows.map(toUser);
};

export const createUser = async (username: string, password: string, phone?: string, email?: string): Promise<AdminUser> => {
  const existing = await pool.query("SELECT 1 FROM admin_users WHERE username = $1", [username]);
  if (existing.rows.length > 0) throw new Error("שם המשתמש כבר קיים");
  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    "INSERT INTO admin_users (username, password_hash, role, phone, email) VALUES ($1, $2, 'admin', $3, $4) RETURNING *",
    [username, hash, phone ?? null, email ?? null],
  );
  return toUser(rows[0]);
};

export const resetPassword = async (id: string, newPassword: string): Promise<void> => {
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [hash, id]);
};

export const updateUser = async (id: string, phone?: string, email?: string): Promise<AdminUser | null> => {
  const { rows } = await pool.query(
    "UPDATE admin_users SET phone = $1, email = $2 WHERE id = $3 AND role != 'owner' RETURNING *",
    [phone ?? null, email ?? null, id],
  );
  return rows.length > 0 ? toUser(rows[0]) : null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query("DELETE FROM admin_users WHERE id = $1 AND role != 'owner'", [id]);
  return (rowCount ?? 0) > 0;
};
