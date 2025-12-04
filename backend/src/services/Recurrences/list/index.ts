import { prisma } from "src/lib/prisma.js";

export const listRecurrences = async (filters: {
  userId: number;
  active?: boolean;
  page?: number;
  limit?: number;
}) => {
  const where: any = {
    userId: filters.userId,
  };

  if (filters.active !== undefined) {
    where.active = filters.active;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const [recurrences, total] = await Promise.all([
    prisma.recurrences.findMany({
      where,
      include: {
        category: true,
        frequency: true,
        transactions: {
          orderBy: {
            installmentNumber: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.recurrences.count({ where }),
  ]);

  return {
    data: recurrences,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
