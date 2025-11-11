import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateRequest } from "../middlewares/validationMiddleware";
import { registerSchema, loginSchema } from "../validators/authValidator";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getProfile);
