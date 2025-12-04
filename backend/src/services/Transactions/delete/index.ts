import { prisma } from "src/lib/prisma.js";

export const deleteTransaction = async (id: number, userId: number) => {
  // Verifica se a transação existe e pertence ao usuário
  const transaction = await prisma.transactions.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!transaction) {
    throw new Error("Transação não encontrada");
  }

  await prisma.transactions.delete({
    where: {
      id,
    },
  });

  return { message: "Transação deletada com sucesso" };
};
