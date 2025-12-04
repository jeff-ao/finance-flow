import { Request, Response, NextFunction } from "express";
import { TransactionsService } from "src/services/Transactions/index.js";
import { listTransactionsSchema } from "src/validators/transactions/list/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const listTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedQuery = listTransactionsSchema.parse(req.query);
    const user = await getUserByUuid(req.user?.userUuid);

    const transactionsService = TransactionsService.getInstance();

    const transactions = await transactionsService.list({
      userId: user.id,
      month: validatedQuery.month,
      year: validatedQuery.year,
      status: validatedQuery.status,
      title: validatedQuery.title,
      categoryId: validatedQuery.category_id,
      type: validatedQuery.type,
      page: validatedQuery.page,
      limit: validatedQuery.limit,
    });

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};
