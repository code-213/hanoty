import { injectable, inject } from "inversify";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product, ProductStatus } from "../../../domain/entities/Product";
import { Money } from "../../../domain/value-objects/Money";
import { CreateProductDTO } from "../../dtos/ProductDTO";

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository
  ) {}

  async execute(dto: CreateProductDTO, sellerId: string): Promise<Product> {
    const product = new Product({
      name: dto.name,
      description: dto.description,
      price: new Money(dto.price),
      stock: dto.stock,
      category: dto.category,
      sku: dto.sku,
      sellerId,
      images: dto.images,
      status: ProductStatus.ACTIVE,
    });

    return await this.productRepository.save(product);
  }
}
