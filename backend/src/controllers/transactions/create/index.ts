import { Request, Response, NextFunction } from "express";
import { TransactionsService } from "src/services/Transactions/index.js";
import { createTransactionSchema } from "src/validators/transactions/create/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createTransactionSchema.parse(req.body);
    const user = await getUserByUuid(req.user?.userUuid);

    console.log("📝 Dados validados:", {
      category_id: validatedData.category_id,
      title: validatedData.title,
    });

    const transactionsService = TransactionsService.getInstance();

    const transaction = await transactionsService.create({
      title: validatedData.title,
      value: validatedData.amount,
      date:
        typeof validatedData.date === "string"
          ? new Date(validatedData.date)
          : validatedData.date,
      type: validatedData.type,
      categoryId: validatedData.category_id,
      status: validatedData.status,
      userId: user.id,
    });

    console.log("✅ Transação criada com categoryId:", transaction.categoryId);

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};
