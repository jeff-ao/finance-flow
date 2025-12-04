import { success, z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const authResponseSchema = z.object({
  token: z.string(),
  success: z.boolean(),
  message: z.string(),
});

// Schema para resposta de registro (API retorna formato diferente)
export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string(),
});

// Category Schema
export const categorySchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string(),
  webDeviceIcon: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const categoriesResponseSchema = z.array(categorySchema);

// Transaction Schemas
export const transactionSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  value: z.string().or(z.number()),
  title: z.string(),
  date: z.string(),
  type: z.enum(["INPUT", "OUTPUT"]),
  installmentNumber: z.number(),
  status: z.enum(["PENDING", "PAID"]),
  recurrenceId: z.number().nullable(),
  categoryId: z.number().nullable(),
  userId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  category: categorySchema.nullable().optional(),
});

export const transactionsResponseSchema = z.object({
  data: z.array(transactionSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.number().positive("Valor deve ser positivo"),
  date: z.string().or(z.date()),
  type: z.enum(["INPUT", "OUTPUT"]),
  status: z.enum(["PENDING", "PAID"]),
  category_id: z.number().optional(),
});

export const updateTransactionSchema = z.object({
  title: z.string().optional(),
  value: z.number().positive().optional(),
  date: z.string().or(z.date()).optional(),
  type: z.enum(["INPUT", "OUTPUT"]).optional(),
  status: z.enum(["PENDING", "PAID"]).optional(),
  category_id: z.number().optional(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
