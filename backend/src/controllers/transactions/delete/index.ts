import { Request, Response, NextFunction } from "express";
import { TransactionsService } from "src/services/Transactions/index.js";
import { deleteTransactionSchema } from "src/validators/transactions/delete/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedParams = deleteTransactionSchema.parse(req.params);
    const user = await getUserByUuid(req.user?.userUuid);

    const transactionsService = TransactionsService.getInstance();
    const result = await transactionsService.delete(validatedParams.id, user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
