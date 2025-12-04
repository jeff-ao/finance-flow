import { Request, Response, NextFunction } from "express";
import { RecurrencesService } from "src/services/Recurrences/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const getRecurrenceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recurrenceId = parseInt(req.params.id);
    const user = await getUserByUuid(req.user?.userUuid);

    const recurrencesService = RecurrencesService.getInstance();

    const recurrence = await recurrencesService.getById(recurrenceId, user.id);

    res.status(200).json(recurrence);
  } catch (error) {
    next(error);
  }
};
