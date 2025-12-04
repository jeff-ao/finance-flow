import { z } from "zod";

export const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;
