import { z } from "zod";

export const BillboardValidator = z.object({
  label: z.string().min(1, { message: "At lease 1 characters" }),
  imageUrl: z.string().min(1, { message: "Check your image" }),
});

export type BillboardRequest = z.infer<typeof BillboardValidator>;
