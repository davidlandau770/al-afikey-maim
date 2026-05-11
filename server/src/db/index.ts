import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { POSTGRES_CONNECTION_STRING, ADMIN_DEFAULT_PASSWORD } from "../helpers/environments";

const url = new URL(POSTGRES_CONNECTION_STRING);
const dbName = url.pathname.slice(1);

const adminPool = new Pool({ connectionString: POSTGRES_CONNECTION_STRING.replace(url.pathname, "/postgres") });
const pool = new Pool({ connectionString: POSTGRES_CONNECTION_STRING });

export const init = async (): Promise<void> => {
  const { rows } = await adminPool.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName],
  );
  if (rows.length === 0) {
    await adminPool.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created`);
  }
  await adminPool.end();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      original_price NUMERIC,
      category TEXT NOT NULL,
      featured BOOLEAN NOT NULL DEFAULT false,
      pages INTEGER,
      image TEXT,
      sold_out BOOLEAN NOT NULL DEFAULT false,
      stock INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_out BOOLEAN NOT NULL DEFAULT false`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER`);
  await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}'`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      text TEXT,
      link TEXT,
      link_text TEXT,
      bg_color TEXT NOT NULL DEFAULT '#1B6B8A',
      bg_image TEXT,
      position INTEGER NOT NULL DEFAULT 0,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS bg_image TEXT`);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS image_height INTEGER`);
  await pool.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS banner_link TEXT`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS game_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      game_type TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`);

  const { rows: adminRows } = await pool.query("SELECT 1 FROM admin_users WHERE role = 'owner'");
  if (adminRows.length === 0) {
    const { rowCount } = await pool.query("UPDATE admin_users SET role = 'owner' WHERE username = 'admin'");
    if ((rowCount ?? 0) === 0) {
      const hash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 12);
      await pool.query(
        "INSERT INTO admin_users (username, password_hash, role) VALUES ('developer', $1, 'owner')",
        [hash],
      );
      console.log("Owner user created. Username: developer | Password:", ADMIN_DEFAULT_PASSWORD);
    }
  }
  // Migrate owner username to 'developer'
  await pool.query("UPDATE admin_users SET username = 'developer' WHERE role = 'owner' AND username IN ('admin', 'מפתח')");

  // Always sync owner password from env
  const ownerHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 12);
  await pool.query("UPDATE admin_users SET password_hash = $1 WHERE role = 'owner'", [ownerHash]);
};

export default pool;
