import { prisma } from "src/lib/prisma.js";
import { AppError } from "src/middlewares/error.middleware.js";

export const getUserByUuid = async (userUuid?: string) => {
  if (!userUuid) {
    throw new AppError("Usuário não autenticado", 401);
  }

  const user = await prisma.users.findUnique({
    where: { uuid: userUuid },
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
};
