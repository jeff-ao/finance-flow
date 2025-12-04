import { Request, Response, NextFunction } from "express";
import { CategoriesService } from "src/services/Categories/index.js";

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoriesService = CategoriesService.getInstance();
    const categories = await categoriesService.list();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
