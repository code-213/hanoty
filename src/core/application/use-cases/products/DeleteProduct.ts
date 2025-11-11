import { injectable, inject } from "inversify";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../../shared/errors/AppError";

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository
  ) {}

  async execute(productId: string, sellerId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product");
    }

    // Check ownership
    if (product["props"].sellerId !== sellerId) {
      throw new UnauthorizedError("Not authorized to delete this product");
    }

    // Soft delete
    product.softDelete();
    await this.productRepository.update(product);
  }
}
