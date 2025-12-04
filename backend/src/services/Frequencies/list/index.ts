import { prisma } from "src/lib/prisma.js";

export const listFrequencies = async () => {
  const frequencies = await prisma.frequencies.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return frequencies;
};
