import { injectable, inject } from "inversify";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product } from "../../../domain/entities/Product";
import { Money } from "../../../domain/value-objects/Money";
import { UpdateProductDTO } from "../../dtos/ProductDTO";
import {
  NotFoundError,
  UnauthorizedError,
} from "../../../../shared/errors/AppError";

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository
  ) {}

  async execute(
    productId: string,
    dto: UpdateProductDTO,
    sellerId: string
  ): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError("Product");
    }

    // Check ownership
    if (product["props"].sellerId !== sellerId) {
      throw new UnauthorizedError("Not authorized to update this product");
    }

    if (dto.name || dto.description || dto.price) {
      product.updateDetails(
        dto.name || product.name,
        dto.description || product["props"].description,
        dto.price ? new Money(dto.price) : product.price
      );
    }

    if (dto.stock !== undefined) {
      const stockDiff = dto.stock - product.stock;
      product.updateStock(stockDiff);
    }

    if (dto.status === "active") {
      product.activate();
    } else if (dto.status === "inactive") {
      product.deactivate();
    }

    return await this.productRepository.update(product);
  }
}
