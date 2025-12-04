import { Request, Response, NextFunction } from "express";
import { RecurrencesService } from "src/services/Recurrences/index.js";
import { deleteRecurrenceSchema } from "src/validators/recurrences/delete/index.js";
import { getUserByUuid } from "src/lib/getUserByUuid.js";

export const deleteRecurrence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recurrenceId = parseInt(req.params.id);
    const user = await getUserByUuid(req.user?.userUuid);

    const validatedData = deleteRecurrenceSchema.parse(req.body);

    const recurrencesService = RecurrencesService.getInstance();

    await recurrencesService.delete(
      recurrenceId,
      user.id,
      validatedData.keep_history
    );

    res.status(200).json({ message: "Recorrência deletada com sucesso" });
  } catch (error) {
    next(error);
  }
};
