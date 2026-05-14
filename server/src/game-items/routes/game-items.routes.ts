import express from "express";
import multer from "multer";
import { getItems, createItem, createNikudMatchItem, deleteItem } from "../controllers/game-items.controller";
import { requireAuth } from "../../auth/middlewares/requireAuth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/nikud_match", requireAuth, upload.single("image"), createNikudMatchItem);
router.get("/:gameType", getItems);
router.post("/:gameType", requireAuth, createItem);
router.delete("/:id", requireAuth, deleteItem);

export default router;
