import { Request, Response, NextFunction } from "express";
import {
  TransactionsService,
  UpdateScope,
} from "src/services/Transactions/index.js";
import { updateTransactionSchema } from "src/validators/transactions/update/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";
import { AppError } from "src/middlewares/error.middleware.js";

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateTransactionSchema.parse(req.body);
    const transactionId = parseInt(req.params.id);
    const scope = (req.query.scope as string)?.toUpperCase() || "SINGLE";

    const user = await getUserByUuid(req.user?.userUuid);

    if (!["SINGLE", "FUTURE", "ALL"].includes(scope)) {
      throw new AppError("Escopo inválido. Use: SINGLE, FUTURE ou ALL", 400);
    }

    const transactionsService = TransactionsService.getInstance();

    const transaction = await transactionsService.update(
      transactionId,
      user.id,
      {
        value: validatedData.amount,
        date: validatedData.date,
        status: validatedData.status,
        title: validatedData.title,
        categoryId: validatedData.category_id,
      },
      scope as UpdateScope
    );

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};
