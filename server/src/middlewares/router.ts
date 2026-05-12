import express from "express";
import contactRoutes from "../contact/routes/contact.routes";
import ordersRoutes from "../orders/routes/orders.routes";
import productsRoutes from "../products/routes/products.routes";
import bannersRoutes from "../banners/routes/banners.routes";
import gameItemsRoutes from "../game-items/routes/game-items.routes";
import authRoutes from "../auth/routes/auth.routes";
import blogRoutes from "../blog/routes/blog.routes";
import pool from "../db";

const router = express.Router();

router.get("/api/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

router.use("/api/contact", contactRoutes);
router.use("/api/orders", ordersRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/banners", bannersRoutes);
router.use("/api/game-items", gameItemsRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/blog", blogRoutes);

export default router;
