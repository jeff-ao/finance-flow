import { z } from "zod";

export const listTransactionsSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).optional(),
  status: z.enum(["PENDING", "PAID"]).optional(),
  title: z.string().optional(),
  category_id: z.coerce.number().int().optional(),
  type: z.enum(["INPUT", "OUTPUT"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export type ListTransactionsInput = z.infer<typeof listTransactionsSchema>;
