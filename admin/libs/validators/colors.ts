import { z } from "zod";

export const ColorValidator = z.object({
  name: z.string().min(1, { message: "At lease 1 characters" }),
  value: z.string().min(4, { message: "String must be a valid hex code" }),
});

export type ColorRequest = z.infer<typeof ColorValidator>;
