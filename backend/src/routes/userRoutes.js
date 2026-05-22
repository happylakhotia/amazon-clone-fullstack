import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Define user endpoints
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;
