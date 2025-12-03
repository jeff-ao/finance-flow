import { prisma } from "src/lib/prisma.js";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../findByEmail/index.js";
import { CreateUserInput } from "src/validators/users/create/index.js";
import { AppError } from "src/middlewares/error.middleware.js";

export const createUser = async (data: CreateUserInput) => {
  try {
    const exsistingUser = await findUserByEmail(data.email);
    if (exsistingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.users.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};
