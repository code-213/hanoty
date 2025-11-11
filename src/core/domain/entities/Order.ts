import { Money } from "../value-objects/Money";

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: Money;
  subtotal: Money;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface OrderProps {
  id?: string;
  orderNumber: string;
  customerId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: Money;
  shippingCost: Money;
  tax: Money;
  total: Money;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order {
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: OrderProps): void {
    if (!props.customerId || !props.sellerId) {
      throw new Error("Customer ID and Seller ID are required");
    }
    if (!props.items || props.items.length === 0) {
      throw new Error("Order must have at least one item");
    }
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get orderNumber(): string {
    return this.props.orderNumber;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get total(): Money {
    return this.props.total;
  }

  updateStatus(
    newStatus: OrderStatus,
    trackingNumber?: string,
    notes?: string
  ): void {
    this.props.status = newStatus;
    if (trackingNumber) {
      this.props.trackingNumber = trackingNumber;
    }
    if (notes) {
      this.props.notes = notes;
    }
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    if (
      this.props.status === OrderStatus.DELIVERED ||
      this.props.status === OrderStatus.COMPLETED
    ) {
      throw new Error("Cannot cancel delivered or completed orders");
    }
    this.props.status = OrderStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.props.id,
      orderNumber: this.props.orderNumber,
      customerId: this.props.customerId,
      sellerId: this.props.sellerId,
      items: this.props.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price.getAmount(),
        subtotal: item.subtotal.getAmount(),
      })),
      subtotal: this.props.subtotal.getAmount(),
      shippingCost: this.props.shippingCost.getAmount(),
      tax: this.props.tax.getAmount(),
      total: this.props.total.getAmount(),
      status: this.props.status,
      shippingAddress: this.props.shippingAddress,
      paymentMethod: this.props.paymentMethod,
      trackingNumber: this.props.trackingNumber,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
