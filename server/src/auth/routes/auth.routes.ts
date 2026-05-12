import express from "express";
import { login, changePassword, getUsers, createUser, resetPassword, updateUser, deleteUser } from "../controllers/auth.controller";
import { requireAuth, requireOwner } from "../middlewares/requireAuth";

const router = express.Router();

router.post("/login", login);
router.post("/change-password", requireAuth, changePassword);

// Both roles can view and add users; only owner can reset password or delete
router.get("/users", requireAuth, getUsers);
router.post("/users", requireAuth, createUser);
router.patch("/users/:id", requireOwner, updateUser);
router.post("/users/:id/reset-password", requireOwner, resetPassword);
router.delete("/users/:id", requireOwner, deleteUser);

export default router;
