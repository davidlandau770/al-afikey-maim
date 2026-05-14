import pool from "../../db";
import type { Testimonial } from "../types/testimonial.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toItem = (row: any): Testimonial => ({
  id: row.id,
  quote: row.quote,
  name: row.name,
  role: row.role,
  createdAt: row.created_at,
});

export const getAll = async (): Promise<Testimonial[]> => {
  const { rows } = await pool.query("SELECT * FROM testimonials ORDER BY created_at ASC");
  return rows.map(toItem);
};

export const create = async (quote: string, name: string, role: string): Promise<Testimonial> => {
  const { rows } = await pool.query(
    "INSERT INTO testimonials (quote, name, role) VALUES ($1, $2, $3) RETURNING *",
    [quote, name, role],
  );
  return toItem(rows[0]);
};

export const update = async (id: string, quote: string, name: string, role: string): Promise<Testimonial | null> => {
  const { rows } = await pool.query(
    "UPDATE testimonials SET quote = $1, name = $2, role = $3 WHERE id = $4 RETURNING *",
    [quote, name, role, id],
  );
  return rows.length > 0 ? toItem(rows[0]) : null;
};

export const remove = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query("DELETE FROM testimonials WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
};
