import { Router } from "express";
import authController from "../controllers/authСontroller.js";
const router = new Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refreshtoken", authController.refreshToken);

export default router;