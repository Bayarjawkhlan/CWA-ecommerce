import { z } from "zod";

export const CategoryValidator = z.object({
  name: z.string().min(1, { message: "At lease 1 characters" }),
  billboardId: z.string().min(15, { message: "Check a billboard" }),
});

export type CategoryRequest = z.infer<typeof CategoryValidator>;
