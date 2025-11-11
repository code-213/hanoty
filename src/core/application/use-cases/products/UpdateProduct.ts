@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject('IProductRepository') private productRepository: IProductRepository
  ) {}

  async execute(productId: string, dto: UpdateProductDTO, sellerId: string): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new NotFoundError('Product');
    }

    // Check ownership
    if (product['props'].sellerId !== sellerId) {
      throw new UnauthorizedError('Not authorized to update this product');
    }

    if (dto.name && dto.price) {
      product.updateDetails(dto.name, dto.description || '', new Money(dto.price));
    }

    if (dto.stock !== undefined) {
      const stockDiff = dto.stock - product.stock;
      product.updateStock(stockDiff);
    }

    if (dto.status === 'active') {
      product.activate();
    } else if (dto.status === 'inactive') {
      product.deactivate();
    }
