import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@finance-flow:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas redireciona em caso de 401 se não for uma rota de autenticação
    if (error.response?.status === 401) {
      const isAuthRoute =
        error.config?.url?.includes("/login") ||
        error.config?.url?.includes("/users");

      if (!isAuthRoute) {
        localStorage.removeItem("@finance-flow:token");
        localStorage.removeItem("@finance-flow:user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export { api };
