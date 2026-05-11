import express from "express";
import { sendContactController } from "../controllers/contact.controller";

const router = express.Router();

router.post("/", sendContactController);

export default router;
