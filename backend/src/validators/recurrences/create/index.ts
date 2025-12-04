import { z } from "zod";

export const createRecurrenceSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  amount: z.number().positive("Valor deve ser positivo"),
  startDate: z.string().datetime("Data inválida").or(z.date()),
  type: z.enum(["INPUT", "OUTPUT"]),
  categoryId: z.number().int().positive().optional(),
  totalInstallments: z.number().int().positive().optional(),
  frequencyId: z.number().int().positive("Frequência é obrigatória"),
  customInterval: z.number().int().positive().optional(),
  customUnit: z.string().optional(),
});

export type CreateRecurrenceInput = z.infer<typeof createRecurrenceSchema>;
