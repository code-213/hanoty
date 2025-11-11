import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().nonnegative("Stock must be non-negative"),
    category: z.string().min(1, "Category is required"),
    sku: z.string().min(1, "SKU is required"),
    images: z.array(z.string().url()).min(1, "At least one image is required"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});
