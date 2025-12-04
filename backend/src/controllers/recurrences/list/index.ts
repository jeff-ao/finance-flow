import { Request, Response, NextFunction } from "express";
import { RecurrencesService } from "src/services/Recurrences/index.js";
import { listRecurrencesSchema } from "src/validators/recurrences/list/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const listRecurrences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedQuery = listRecurrencesSchema.parse(req.query);
    const user = await getUserByUuid(req.user?.userUuid);

    const recurrencesService = RecurrencesService.getInstance();

    const recurrences = await recurrencesService.list({
      userId: user.id,
      active: validatedQuery.active,
      page: validatedQuery.page,
      limit: validatedQuery.limit,
    });

    res.status(200).json(recurrences);
  } catch (error) {
    next(error);
  }
};
