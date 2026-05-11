import express from "express";
import multer from "multer";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller";
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

const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", getProducts);
router.post("/", requireAuth, uploadFields, createProduct);
router.put("/:id", requireAuth, uploadFields, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
