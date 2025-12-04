import { z } from "zod";

export const deleteRecurrenceSchema = z.object({
  keepHistory: z.boolean().default(false),
});

export type DeleteRecurrenceInput = z.infer<typeof deleteRecurrenceSchema>;
