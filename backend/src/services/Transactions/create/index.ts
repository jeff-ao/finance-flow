import { prisma } from "src/lib/prisma.js";
import { TransactionType, TransactionStatus } from "generated/prisma/client.js";

export const createTransaction = async (data: {
  title: string;
  value: number;
  date: Date;
  type: TransactionType;
  categoryId?: number;
  status: TransactionStatus;
  userId: number;
  recurrenceId?: number;
  installmentNumber?: number;
}) => {
  const transaction = await prisma.transactions.create({
    data: {
      title: data.title,
      value: data.value,
      date: data.date,
      type: data.type,
      status: data.status,
      userId: data.userId,
      categoryId: data.categoryId,
      recurrenceId: data.recurrenceId,
      installmentNumber: data.installmentNumber || 1,
    },
    include: {
      category: true,
      recurrence: true,
    },
  });

  return transaction;
};
