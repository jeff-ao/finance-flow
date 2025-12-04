import { prisma } from "src/lib/prisma.js";
import { TransactionStatus, TransactionType } from "generated/prisma/client.js";

export enum UpdateScope {
  SINGLE = "SINGLE",
  FUTURE = "FUTURE",
  ALL = "ALL",
}

export const updateTransaction = async (
  transactionId: number,
  userId: number,
  data: {
    value?: number;
    date?: Date;
    status?: TransactionStatus;
    title?: string;
    type?: TransactionType;
    categoryId?: number;
  },
  scope: UpdateScope = UpdateScope.SINGLE
) => {
  // Buscar a transação para verificar se pertence ao usuário
  const transaction = await prisma.transactions.findFirst({
    where: {
      id: transactionId,
      userId,
    },
    include: {
      recurrence: true,
    },
  });

  if (!transaction) {
    throw new Error("Transação não encontrada");
  }

  // SINGLE: Atualiza apenas esta transação
  if (scope === UpdateScope.SINGLE || !transaction.recurrenceId) {
    const updated = await prisma.transactions.update({
      where: { id: transactionId },
      data,
      include: {
        category: true,
        recurrence: true,
      },
    });
    return updated;
  }

  // FUTURE: Atualiza esta e as futuras
  if (scope === UpdateScope.FUTURE) {
    await prisma.transactions.updateMany({
      where: {
        recurrenceId: transaction.recurrenceId,
        installmentNumber: {
          gte: transaction.installmentNumber,
        },
        userId,
      },
      data,
    });

    const updated = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
        recurrence: true,
      },
    });
    return updated;
  }

  // ALL: Atualiza todas da recorrência
  if (scope === UpdateScope.ALL) {
    await prisma.transactions.updateMany({
      where: {
        recurrenceId: transaction.recurrenceId,
        userId,
      },
      data,
    });

    const updated = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
        recurrence: true,
      },
    });
    return updated;
  }

  throw new Error("Escopo de atualização inválido");
};
