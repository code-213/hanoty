import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { container } from "../../../../config/container";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { CreateProductUseCase } from "../../../application/use-cases/products/CreateProduct";
import { UpdateProductUseCase } from "../../../application/use-cases/products/UpdateProduct";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../../shared/errors/AppError";

export class ProductController {
  async getProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const productRepository =
        container.get<IProductRepository>("IProductRepository");
      const { products, total } = await productRepository.findBySellerId(
        req.user!.userId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: {
          products: products.map((p) => p.toJSON()),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const productRepository =
        container.get<IProductRepository>("IProductRepository");
      const product = await productRepository.findById(req.params.id);

      if (!product) {
        throw new NotFoundError("Product");
      }

      res.status(200).json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const createProductUseCase =
        container.get<CreateProductUseCase>(CreateProductUseCase);
      const product = await createProductUseCase.execute(
        req.body,
        req.user!.userId
      );

      res.status(201).json({
        success: true,
        data: product.toJSON(),
        message: "Product created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const updateProductUseCase =
        container.get<UpdateProductUseCase>(UpdateProductUseCase);
      const product = await updateProductUseCase.execute(
        req.params.id,
        req.body,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: product.toJSON(),
        message: "Product updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const productRepository =
        container.get<IProductRepository>("IProductRepository");
      const product = await productRepository.findById(req.params.id);

      if (!product) {
        throw new NotFoundError("Product");
      }

      // Check ownership
      if (product["props"].sellerId !== req.user!.userId) {
        throw new UnauthorizedError("Not authorized to delete this product");
      }

      await productRepository.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
