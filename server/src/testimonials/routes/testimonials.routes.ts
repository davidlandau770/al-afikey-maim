import express from "express";
import { getAll, create, update, remove } from "../controllers/testimonials.controller";
import { requireAuth } from "../../auth/middlewares/requireAuth";

const router = express.Router();

router.get("/", getAll);
router.post("/", requireAuth, create);
router.put("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

export default router;
