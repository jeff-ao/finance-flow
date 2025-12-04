import { prisma } from "src/lib/prisma.js";
import { TransactionStatus } from "generated/prisma/client.js";

export const deleteRecurrence = async (
  id: number,
  userId: number,
  keepHistory: boolean = false
) => {
  // Verificar se a recorrência existe e pertence ao usuário
  const recurrence = await prisma.recurrences.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!recurrence) {
    throw new Error("Recorrência não encontrada");
  }

  if (keepHistory) {
    // Deleta apenas as transações pendentes
    await prisma.transactions.deleteMany({
      where: {
        recurrenceId: id,
        status: TransactionStatus.PENDING,
      },
    });

    // Marca a recorrência como inativa
    await prisma.recurrences.update({
      where: { id },
      data: { active: false },
    });
  } else {
    // Deleta todas as transações da recorrência
    await prisma.transactions.deleteMany({
      where: {
        recurrenceId: id,
      },
    });

    // Deleta a recorrência
    await prisma.recurrences.delete({
      where: { id },
    });
  }

  return { success: true };
};
