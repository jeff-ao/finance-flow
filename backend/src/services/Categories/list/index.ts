import { prisma } from "src/lib/prisma.js";

export const listCategories = async () => {
  const categories = await prisma.categories.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};
