export interface CreateOrderDTO {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: string;
}

export interface UpdateOrderStatusDTO {
  status: string;
  trackingNumber?: string;
  notes?: string;
}
