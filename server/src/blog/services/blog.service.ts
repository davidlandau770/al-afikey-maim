import pool from "../../db";
import type { BlogPost } from "../types/blog.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toPost = (row: any): BlogPost => ({
  id: row.id,
  title: row.title,
  content: row.content,
  image: row.image ?? undefined,
  createdAt: row.created_at,
});

export const getAll = async (): Promise<BlogPost[]> => {
  const { rows } = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
  return rows.map(toPost);
};

export const getById = async (id: string): Promise<BlogPost | null> => {
  const { rows } = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [id]);
  return rows.length ? toPost(rows[0]) : null;
};

export const create = async (data: Omit<BlogPost, "id" | "createdAt">): Promise<BlogPost> => {
  const { rows } = await pool.query(
    "INSERT INTO blog_posts (title, content, image) VALUES ($1, $2, $3) RETURNING *",
    [data.title, data.content, data.image ?? null],
  );
  return toPost(rows[0]);
};

export const update = async (id: string, data: Partial<Omit<BlogPost, "id" | "createdAt">>): Promise<BlogPost | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.content !== undefined) { fields.push(`content = $${idx++}`); values.push(data.content); }
  if ("image" in data) { fields.push(`image = $${idx++}`); values.push(data.image ?? null); }

  if (fields.length === 0) return null;

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE blog_posts SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return rows.length ? toPost(rows[0]) : null;
};

export const remove = async (id: string): Promise<BlogPost | null> => {
  const { rows } = await pool.query("DELETE FROM blog_posts WHERE id = $1 RETURNING *", [id]);
  return rows.length ? toPost(rows[0]) : null;
};