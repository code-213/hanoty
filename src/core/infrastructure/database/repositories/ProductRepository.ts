import { injectable } from "inversify";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product, ProductStatus } from "../../../domain/entities/Product";
import { Money } from "../../../domain/value-objects/Money";
import { ProductModel } from "../models/ProductModel";

@injectable()
export class ProductRepository implements IProductRepository {
  async findById(id: string): Promise<Product | null> {
    const productModel = await ProductModel.findByPk(id);
    return productModel ? this.toDomain(productModel) : null;
  }

  async findBySellerId(
    sellerId: string,
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductModel.findAndCountAll({
      where: { sellerId, status: ["active", "inactive"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const products = rows.map((row) => this.toDomain(row));
    return { products, total: count };
  }

  async save(product: Product): Promise<Product> {
    const productJSON = product.toJSON();
    const productModel = await ProductModel.create({
      name: productJSON.name,
      description: productJSON.description,
      price: productJSON.price,
      stock: productJSON.stock,
      category: productJSON.category,
      sku: productJSON.sku,
      sellerId: productJSON.sellerId,
      images: productJSON.images,
      status: productJSON.status,
    });
    return this.toDomain(productModel);
  }

  async update(product: Product): Promise<Product> {
    const productJSON = product.toJSON();
    await ProductModel.update(
      {
        name: productJSON.name,
        description: productJSON.description,
        price: productJSON.price,
        stock: productJSON.stock,
        status: productJSON.status,
      },
      { where: { id: product.id } }
    );
    return product;
  }

  async delete(id: string): Promise<void> {
    await ProductModel.destroy({ where: { id } });
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await ProductModel.findAndCountAll({
      where: { status: ["active", "inactive"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const products = rows.map((row) => this.toDomain(row));
    return { products, total: count };
  }

  private toDomain(model: ProductModel): Product {
    return new Product({
      id: model.id,
      name: model.name,
      description: model.description,
      price: new Money(parseFloat(model.price.toString())),
      stock: model.stock,
      category: model.category,
      sku: model.sku,
      sellerId: model.sellerId,
      images: model.images,
      status: model.status as ProductStatus,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
