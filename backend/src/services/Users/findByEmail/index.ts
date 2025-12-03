import { prisma } from "src/lib/prisma.js";

export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
