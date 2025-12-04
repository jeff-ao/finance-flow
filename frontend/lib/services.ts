import { api } from "@/lib/api";
import {
  loginSchema,
  registerSchema,
  authResponseSchema,
  registerResponseSchema,
  categoriesResponseSchema,
  transactionSchema,
  transactionsResponseSchema,
  type LoginInput,
  type RegisterInput,
  type AuthResponse,
  type RegisterResponse,
  type Category,
  type Transaction,
  type TransactionsResponse,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from "@/lib/schemas";

// Auth Services
export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post("/login", data);
    return authResponseSchema.parse(response.data);
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post("/users", data);
    const registerData = registerResponseSchema.parse(response.data);

    // Converte RegisterResponse para AuthResponse
    // Como a API não retorna os dados do usuário no registro,
    // fazemos o login automático para obter os dados completos
    return registerData;
  },

  logout() {
    localStorage.removeItem("@finance-flow:token");
    localStorage.removeItem("@finance-flow:user");
  },

  getStoredToken(): string | null {
    return localStorage.getItem("@finance-flow:token");
  },

  storeAuth(auth: AuthResponse) {
    localStorage.setItem("@finance-flow:token", auth.token);
  },
};

// Category Services
export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await api.get("/categories");
    return categoriesResponseSchema.parse(response.data);
  },
};

// Transaction Services
export const transactionService = {
  async list(params?: {
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
  }): Promise<TransactionsResponse> {
    const response = await api.get("/transactions", { params });
    return transactionsResponseSchema.parse(response.data);
  },

  async create(data: CreateTransactionInput): Promise<Transaction> {
    const response = await api.post("/transactions", {
      title: data.title,
      amount: data.value,
      date: data.date,
      type: data.type,
      status: data.status,
      category_id: data.category_id,
    });
    return transactionSchema.parse(response.data);
  },

  async update(
    id: number,
    data: UpdateTransactionInput,
    scope?: "SINGLE" | "FUTURE" | "ALL"
  ): Promise<Transaction> {
    const response = await api.patch(`/transactions/${id}`, data, {
      params: { scope },
    });
    return transactionSchema.parse(response.data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
