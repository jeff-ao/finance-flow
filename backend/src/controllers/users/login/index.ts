import { UsersService } from "src/services/Users/index.js";
import { Request, Response, NextFunction } from "express";
import { th } from "zod/v4/locales";
import bcrypt from "bcryptjs";
import { generateToken } from "src/middlewares/auth.middleware.js";
import { loginUserSchema } from "src/validators/users/login/index.js";
import { AppError } from "src/middlewares/error.middleware.js";
import { SuccessResponse } from "src/middlewares/success-response.middleware.js";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    const usersService = UsersService.getInstance();

    const user = await usersService.findByEmail(validatedData.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({ userUuid: user.uuid });
    // Here you would typically generate a JWT or session for the user
    SuccessResponse.withToken(res, token, "Login successful");
  } catch (error) {
    next(error);
  }
};
