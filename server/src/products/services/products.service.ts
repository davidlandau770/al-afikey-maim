import pool from "../../db";
import type { Product } from "../types/product.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: Number(row.price),
  originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
  category: row.category,
  featured: row.featured,
  pages: row.pages != null ? Number(row.pages) : undefined,
  image: row.image ?? undefined,
  images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
  soldOut: row.sold_out ?? false,
  stock: row.stock != null ? Number(row.stock) : undefined,
});

export const getAll = async (): Promise<Product[]> => {
  const { rows } = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows.map(toProduct);
};

export const create = async (data: Omit<Product, "id">): Promise<Product> => {
  const { rows } = await pool.query(
    `INSERT INTO products (name, description, price, original_price, category, featured, pages, image, images, sold_out, stock)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.name,
      data.description,
      data.price,
      data.originalPrice ?? null,
      data.category,
      data.featured,
      data.pages ?? null,
      data.image ?? null,
      data.images ?? [],
      data.soldOut ?? false,
      data.stock ?? null,
    ],
  );
  return toProduct(rows[0]);
};

export const update = async (
  id: string,
  data: Partial<Omit<Product, "id">>,
): Promise<Product | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
  if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
  if (data.price !== undefined) { fields.push(`price = $${idx++}`); values.push(data.price); }
  if ("originalPrice" in data) { fields.push(`original_price = $${idx++}`); values.push(data.originalPrice ?? null); }
  if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
  if (data.featured !== undefined) { fields.push(`featured = $${idx++}`); values.push(data.featured); }
  if ("pages" in data) { fields.push(`pages = $${idx++}`); values.push(data.pages ?? null); }
  if ("image" in data) { fields.push(`image = $${idx++}`); values.push(data.image ?? null); }
  if ("images" in data) { fields.push(`images = $${idx++}`); values.push(data.images ?? []); }
  if ("soldOut" in data) { fields.push(`sold_out = $${idx++}`); values.push(data.soldOut ?? false); }
  if ("stock" in data) { fields.push(`stock = $${idx++}`); values.push(data.stock ?? null); }

  if (fields.length === 0) return null;

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    values,
  );
  return rows.length ? toProduct(rows[0]) : null;
};

export const remove = async (id: string): Promise<Product | null> => {
  const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
  return rows.length ? toProduct(rows[0]) : null;
};
