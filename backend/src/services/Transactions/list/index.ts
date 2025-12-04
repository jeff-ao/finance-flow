import { prisma } from "src/lib/prisma.js";
import { TransactionType, TransactionStatus } from "generated/prisma/client.js";

export const listTransactions = async (filters: {
  userId: number;
  month?: number;
  year?: number;
  status?: TransactionStatus;
  title?: string;
  categoryId?: number;
  type?: TransactionType;
  page?: number;
  limit?: number;
}) => {
  const where: any = {
    userId: filters.userId,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.title) {
    where.title = {
      contains: filters.title,
      mode: "insensitive",
    };
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.month && filters.year) {
    const startDate = new Date(filters.year, filters.month - 1, 1);
    const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59);

    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transactions.findMany({
      where,
      include: {
        category: true,
        recurrence: true,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.transactions.count({ where }),
  ]);

  return {
    data: transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
