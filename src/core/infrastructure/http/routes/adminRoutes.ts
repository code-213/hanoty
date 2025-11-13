import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import { flagCardSchema } from "../validators/adminValidator";

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication
router.use(authMiddleware);

// Check admin role (accessible to all authenticated users)
router.get("/check-role", adminController.checkRole);

// Admin-only routes
router.use(roleMiddleware("admin"));

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// Users management
router.get("/users", adminController.getUsers);

// Cards management
router.get("/cards", adminController.getCards);
router.put(
  "/cards/:id/flag",
  validateRequest(flagCardSchema),
  adminController.flagCard
);
router.put("/cards/:id/unflag", adminController.unflagCard);
router.delete("/cards/:id", adminController.deleteCard);
router.delete("/cards/:id/permanent", adminController.permanentDeleteCard);
router.post("/cards/:id/restore", adminController.restoreCard);

export default router;
