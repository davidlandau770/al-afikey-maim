import express from "express";
import contactRoutes from "../contact/routes/contact.routes";
import ordersRoutes from "../orders/routes/orders.routes";
import productsRoutes from "../products/routes/products.routes";
import bannersRoutes from "../banners/routes/banners.routes";
import gameItemsRoutes from "../game-items/routes/game-items.routes";
import authRoutes from "../auth/routes/auth.routes";

const router = express.Router();

router.use("/api/contact", contactRoutes);
router.use("/api/orders", ordersRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/banners", bannersRoutes);
router.use("/api/game-items", gameItemsRoutes);
router.use("/api/auth", authRoutes);

export default router;
