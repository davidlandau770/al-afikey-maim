import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller";
import { requireAuth } from "../../auth/middlewares/requireAuth";

const IMAGES_DIR = path.resolve(process.cwd(), "public/images");
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("קבצי תמונה בלבד"));
    cb(null, true);
  },
});

const router = express.Router();

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", getProducts);
router.post("/", requireAuth, uploadFields, createProduct);
router.put("/:id", requireAuth, uploadFields, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
