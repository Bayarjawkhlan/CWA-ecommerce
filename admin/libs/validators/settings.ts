import { z } from "zod";

export const SettingsValidator = z.object({
  name: z.string().min(1, { message: "At lease 1 characters" }),
});

export type SettingsRequest = z.infer<typeof SettingsValidator>;
