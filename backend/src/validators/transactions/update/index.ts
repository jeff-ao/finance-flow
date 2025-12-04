import { z } from "zod";

export const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    date: z.string().datetime().or(z.date()).optional(),
    status: z.enum(["PENDING", "PAID"]).optional(),
    title: z.string().min(1).optional(),
    categoryId: z.number().int().positive().optional(),
  }),
  query: z.object({
    scope: z.enum(["SINGLE", "FUTURE", "ALL"]).default("SINGLE"),
  }),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
