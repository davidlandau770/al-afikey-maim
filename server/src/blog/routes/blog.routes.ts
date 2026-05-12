import express from "express";
import multer from "multer";
import { getPosts, getPost, createPost, updatePost, deletePost } from "../controllers/blog.controller";
import { requireAuth } from "../../auth/middlewares/requireAuth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("קבצי תמונה בלבד"));
    cb(null, true);
  },
});

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", requireAuth, upload.single("image"), createPost);
router.put("/:id", requireAuth, upload.single("image"), updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;