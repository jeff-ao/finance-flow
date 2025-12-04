import { prisma } from "src/lib/prisma.js";

export const getRecurrenceById = async (id: number, userId: number) => {
  const recurrence = await prisma.recurrences.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      category: true,
      frequency: true,
      transactions: {
        orderBy: {
          installmentNumber: "asc",
        },
        include: {
          category: true,
        },
      },
    },
  });

  if (!recurrence) {
    throw new Error("Recorrência não encontrada");
  }

  return recurrence;
};
