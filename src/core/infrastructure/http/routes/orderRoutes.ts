import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware);

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);
router.post("/", orderController.createOrder);
router.put("/:id/status", orderController.updateOrderStatus);

export default router;
