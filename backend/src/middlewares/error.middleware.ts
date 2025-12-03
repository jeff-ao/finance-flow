import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Tratamento de erros de validação do Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Erro de validação",
      details: err.issues.map((error) => ({
        field: error.path.join("."),
        message: error.message,
      })),
    });
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Erro interno do servidor";

  console.error("❌ Erro:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    error: message,
    url: req.url,
    method: req.method,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
