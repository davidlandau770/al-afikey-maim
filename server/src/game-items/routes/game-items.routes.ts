import express from "express";
import { getItems, createItem, deleteItem } from "../controllers/game-items.controller";
import { requireAuth } from "../../auth/middlewares/requireAuth";

const router = express.Router();

router.get("/:gameType", getItems);
router.post("/:gameType", requireAuth, createItem);
router.delete("/:id", requireAuth, deleteItem);

export default router;
