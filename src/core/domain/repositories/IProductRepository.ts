export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySellerId(
    sellerId: string,
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findAll(
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }>;
}
