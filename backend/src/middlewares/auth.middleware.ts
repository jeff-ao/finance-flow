import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "application/config/app.cofig.js";

interface JwtPayload {
  userUuid: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Token não fornecido" });
      return;
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      res.status(401).json({ error: "Token mal formatado" });
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({ error: "Token mal formatado" });
      return;
    }

    jwt.verify(token, APP_CONFIG.jwt.SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Token inválido ou expirado" });
        return;
      }

      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar token" });
  }
};

// Função auxiliar para gerar token
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, APP_CONFIG.jwt.SECRET, {
    expiresIn: "7d", // Token expira em 7 dias
  });
};

// Função auxiliar para verificar token
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, APP_CONFIG.jwt.SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
