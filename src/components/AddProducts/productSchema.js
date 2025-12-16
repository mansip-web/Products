import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters"),

  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),

  category: z
    .string()
    .min(1, "Category is required"),

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});
