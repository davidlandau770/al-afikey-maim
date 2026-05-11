import express from "express";
import { createOrderController } from "../controllers/orders.controller";

const router = express.Router();

router.post("/", createOrderController);

export default router;