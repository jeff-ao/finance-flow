import { z } from "zod";

export const updateTransactionSchema = z.object({
  value: z.number().positive().optional(),
  date: z.string().datetime().or(z.date()).optional(),
  status: z.enum(["PENDING", "PAID"]).optional(),
  title: z.string().min(1).optional(),
  type: z.enum(["INPUT", "OUTPUT"]).optional(),
  category_id: z.number().int().positive().nullable().optional(),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
