import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  webDeviceIcon: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
