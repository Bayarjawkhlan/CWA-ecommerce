import { z } from "zod";

export const ProductValidator = z.object({
  name: z.string().min(1, { message: "At lease 1 characters" }),
  images: z.string().array().min(1, { message: "Check at least 1 image " }),
  price: z.coerce.number().min(1),
  categoryId: z.string(),
  sizeId: z.string(),
  colorId: z.string(),
  isArchived: z.boolean(),
  isFeatured: z.boolean(),
});

export type ProductRequest = z.infer<typeof ProductValidator>;
