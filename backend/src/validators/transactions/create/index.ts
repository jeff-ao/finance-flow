import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.number().positive("Valor deve ser positivo"),
  date: z.string().datetime("Data inválida").or(z.date()),
  type: z.enum(["INPUT", "OUTPUT"]),
  category_id: z.number().int().positive().optional(),
  status: z.enum(["PENDING", "PAID"]).default("PENDING"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
