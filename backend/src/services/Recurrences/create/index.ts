import { prisma } from "src/lib/prisma.js";
import { TransactionType, TransactionStatus } from "generated/prisma/client.js";
import { addMonths, addWeeks, addDays, addYears } from "date-fns";

export const createRecurrence = async (data: {
  title: string;
  amount: number;
  startDate: Date;
  type: TransactionType;
  categoryId?: number;
  totalInstallments?: number;
  frequencyId: number;
  userId: number;
}) => {
  // Buscar a frequência
  const frequency = await prisma.frequencies.findUnique({
    where: { id: data.frequencyId },
  });

  if (!frequency) {
    throw new Error("Frequência não encontrada");
  }

  // Criar a recorrência
  const recurrence = await prisma.recurrences.create({
    data: {
      title: data.title,
      totalInstallments: data.totalInstallments,
      startDate: data.startDate,
      type: data.type,
      userId: data.userId,
      categoryId: data.categoryId,
      frequencyId: data.frequencyId,
      active: true,
    },
  });

  // Calcular quantas parcelas criar
  const installmentsToCreate = data.totalInstallments || 12; // Se null, cria 12 meses

  // Criar as transações
  const transactions: any[] = [];
  let currentDate = new Date(data.startDate);

  for (let i = 1; i <= installmentsToCreate; i++) {
    const transaction = await prisma.transactions.create({
      data: {
        title: `${data.title} - ${i}/${data.totalInstallments || "∞"}`,
        value: data.amount,
        date: new Date(currentDate),
        type: data.type,
        status: TransactionStatus.PENDING,
        userId: data.userId,
        categoryId: data.categoryId,
        recurrenceId: recurrence.id,
        installmentNumber: i,
      },
    });

    transactions.push(transaction);

    // Calcular próxima data baseado na frequência
    switch (frequency.intervalUnit.toLowerCase()) {
      case "day":
      case "dias":
        currentDate = addDays(currentDate, frequency.intervalValue);
        break;
      case "week":
      case "semanas":
        currentDate = addWeeks(currentDate, frequency.intervalValue);
        break;
      case "month":
      case "meses":
        currentDate = addMonths(currentDate, frequency.intervalValue);
        break;
      case "year":
      case "anos":
        currentDate = addYears(currentDate, frequency.intervalValue);
        break;
      default:
        currentDate = addMonths(currentDate, frequency.intervalValue);
    }
  }

  return {
    recurrence,
    transactions,
  };
};
