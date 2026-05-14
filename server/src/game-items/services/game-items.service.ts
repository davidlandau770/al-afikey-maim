import pool from "../../db";
import type { GameItem } from "../types/game-item.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toItem = (row: any): GameItem => ({
  id: row.id,
  gameType: row.game_type,
  data: row.data,
});

export const getByType = async (gameType: string): Promise<GameItem[]> => {
  const { rows } = await pool.query(
    "SELECT * FROM game_items WHERE game_type = $1 ORDER BY created_at ASC",
    [gameType],
  );
  return rows.map(toItem);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create = async (gameType: string, data: any): Promise<GameItem> => {
  const { rows } = await pool.query(
    "INSERT INTO game_items (game_type, data) VALUES ($1, $2) RETURNING *",
    [gameType, data],
  );
  return toItem(rows[0]);
};

export const getById = async (id: string): Promise<GameItem | null> => {
  const { rows } = await pool.query("SELECT * FROM game_items WHERE id = $1", [id]);
  return rows.length > 0 ? toItem(rows[0]) : null;
};

export const remove = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query("DELETE FROM game_items WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
};
