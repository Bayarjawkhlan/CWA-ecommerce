import { z } from "zod";

export const StoreValidator = z.object({
  name: z.string().min(2, { message: "At lease 2 characters" }),
});

export type StoreRequest = z.infer<typeof StoreValidator>;
