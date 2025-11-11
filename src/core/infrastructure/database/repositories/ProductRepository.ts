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
      where: { sellerId },
      limit,
      offset,
    });
    const products = rows.map((row) => this.toDomain(row));
    return { products, total: count };
  }

  async save(product: Product): Promise<Product> {
    const productModel = await ProductModel.create({
      name: product.name,
      description: product["props"].description,
      price: product.price.getAmount(),
      stock: product.stock,
      category: product["props"].category,
      sku: product["props"].sku,
      sellerId: product["props"].sellerId,
      images: product["props"].images,
      status: product.status,
    });
    return this.toDomain(productModel);
  }

  async update(product: Product): Promise<Product> {
    await ProductModel.update(
      {
        name: product.name,
        price: product.price.getAmount(),
        stock: product.stock,
        status: product.status,
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
      limit,
      offset,
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
      status: model.status as any,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
