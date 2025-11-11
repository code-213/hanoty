import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator";

const router = Router();
const productController = new ProductController();

router.use(authMiddleware);
router.use(roleMiddleware("seller", "admin"));

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post(
  "/",
  validateRequest(createProductSchema),
  productController.createProduct
);
router.put(
  "/:id",
  validateRequest(updateProductSchema),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
