import { Request, Response, NextFunction } from "express";
import { FrequenciesService } from "src/services/Frequencies/index.js";

export const listFrequencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const frequenciesService = FrequenciesService.getInstance();
    const frequencies = await frequenciesService.list();

    res.status(200).json(frequencies);
  } catch (error) {
    next(error);
  }
};
