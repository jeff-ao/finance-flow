import { prisma } from "src/lib/prisma.js";

export const createCategory = async (data: {
  name: string;
  webDeviceIcon?: string;
}) => {
  const category = await prisma.categories.create({
    data: {
      name: data.name,
      webDeviceIcon: data.webDeviceIcon,
    },
  });

  return category;
};
