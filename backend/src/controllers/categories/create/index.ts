import { Request, Response, NextFunction } from "express";
import { CategoriesService } from "src/services/Categories/index.js";
import { createCategorySchema } from "src/validators/categories/create/index.js";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const categoriesService = CategoriesService.getInstance();
    const category = await categoriesService.create(validatedData);

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
