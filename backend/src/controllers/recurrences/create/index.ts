import { Request, Response, NextFunction } from "express";
import { RecurrencesService } from "src/services/Recurrences/index.js";
import { createRecurrenceSchema } from "src/validators/recurrences/create/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const createRecurrence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createRecurrenceSchema.parse(req.body);
    const user = await getUserByUuid(req.user?.userUuid);

    const recurrencesService = RecurrencesService.getInstance();

    const result = await recurrencesService.create({
      title: validatedData.title,
      amount: validatedData.amount,
      startDate: validatedData.start_date,
      type: validatedData.type,
      categoryId: validatedData.category_id,
      totalInstallments: validatedData.total_installments,
      frequencyId: validatedData.frequency_id,
      userId: user.id,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
