import { ValidationError } from "../../../shared/errors/ValidationError";
import { Money } from "../value-objects/Money";

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
}

export interface ProductProps {
  id?: string;
  name: string;
  description: string;
  price: Money;
  stock: number;
  category: string;
  sku: string;
  sellerId: string;
  images: string[];
  status: ProductStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private props: ProductProps;

  constructor(props: ProductProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: ProductProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError("Product name is required");
    }
    if (props.stock < 0) {
      throw new ValidationError("Stock cannot be negative");
    }
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): Money {
    return this.props.price;
  }

  get stock(): number {
    return this.props.stock;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  updateDetails(name: string, description: string, price: Money): void {
    this.props.name = name;
    this.props.description = description;
    this.props.price = price;
    this.props.updatedAt = new Date();
  }

  updateStock(quantity: number): void {
    if (this.props.stock + quantity < 0) {
      throw new ValidationError("Insufficient stock");
    }
    this.props.stock += quantity;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.status = ProductStatus.ACTIVE;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = ProductStatus.INACTIVE;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    this.props.status = ProductStatus.DELETED;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      name: this.props.name,
      description: this.props.description,
      price: this.props.price.getAmount(),
      currency: this.props.price.getCurrency(),
      stock: this.props.stock,
      category: this.props.category,
      sku: this.props.sku,
      sellerId: this.props.sellerId,
      images: this.props.images,
      status: this.props.status,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
