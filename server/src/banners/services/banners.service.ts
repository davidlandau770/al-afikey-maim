import pool from "../../db";
import type { Banner } from "../types/banner.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toBanner = (row: any): Banner => ({
  id: row.id,
  title: row.title,
  text: row.text ?? undefined,
  bannerLink: row.banner_link ?? undefined,
  link: row.link ?? undefined,
  linkText: row.link_text ?? undefined,
  bgColor: row.bg_color,
  bgImage: row.bg_image ?? undefined,
  imageHeight: row.image_height ?? undefined,
  position: Number(row.position),
  active: row.active,
});

export const getAll = async (): Promise<Banner[]> => {
  const { rows } = await pool.query("SELECT * FROM banners ORDER BY position ASC, created_at ASC");
  return rows.map(toBanner);
};

export const create = async (data: Omit<Banner, "id">): Promise<Banner> => {
  const { rows } = await pool.query(
    `INSERT INTO banners (title, text, banner_link, link, link_text, bg_color, bg_image, image_height, position, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      data.title,
      data.text ?? null,
      data.bannerLink ?? null,
      data.link ?? null,
      data.linkText ?? null,
      data.bgColor,
      data.bgImage ?? null,
      data.imageHeight ?? null,
      data.position,
      data.active,
    ],
  );
  return toBanner(rows[0]);
};

export const update = async (id: string, data: Partial<Omit<Banner, "id">>): Promise<Banner | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if ("text" in data) { fields.push(`text = $${idx++}`); values.push(data.text ?? null); }
  if ("bannerLink" in data) { fields.push(`banner_link = $${idx++}`); values.push(data.bannerLink ?? null); }
  if ("link" in data) { fields.push(`link = $${idx++}`); values.push(data.link ?? null); }
  if ("linkText" in data) { fields.push(`link_text = $${idx++}`); values.push(data.linkText ?? null); }
  if (data.bgColor !== undefined) { fields.push(`bg_color = $${idx++}`); values.push(data.bgColor); }
  if ("bgImage" in data) { fields.push(`bg_image = $${idx++}`); values.push(data.bgImage ?? null); }
  if ("imageHeight" in data) { fields.push(`image_height = $${idx++}`); values.push(data.imageHeight ?? null); }
  if (data.position !== undefined) { fields.push(`position = $${idx++}`); values.push(data.position); }
  if (data.active !== undefined) { fields.push(`active = $${idx++}`); values.push(data.active); }

  if (fields.length === 0) return null;

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE banners SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return rows.length ? toBanner(rows[0]) : null;
};

export const remove = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query("DELETE FROM banners WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
};
