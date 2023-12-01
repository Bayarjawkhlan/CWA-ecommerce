import { z } from "zod";

export const SizeValidator = z.object({
  name: z.string().min(1, { message: "At lease 1 characters" }),
  value: z.string().min(1, { message: "At lease 1 characters" }),
});

export type SizeRequest = z.infer<typeof SizeValidator>;
