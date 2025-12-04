import { z } from "zod";

export const listRecurrencesSchema = z.object({
  active: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export type ListRecurrencesInput = z.infer<typeof listRecurrencesSchema>;
