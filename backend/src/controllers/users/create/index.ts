import { Request, Response, NextFunction } from "express";
import { UsersService } from "src/services/Users/index.js";
import bcrypt from "bcryptjs";
import { createUserSchema } from "src/validators/users/create/index.js";
import { AppError } from "src/middlewares/error.middleware.js";
import { generateToken } from "src/middlewares/auth.middleware.js";
import { SuccessResponse } from "src/middlewares/success-response.middleware.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const usersService = UsersService.getInstance();

    const user = await usersService.create({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
    });

    const token = generateToken({ userUuid: user.uuid });

    SuccessResponse.withToken(res, token, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};
