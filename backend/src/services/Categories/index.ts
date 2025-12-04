import { listCategories } from "./list/index.js";

export class CategoriesService {
  private static instance: CategoriesService;

  private constructor() {}

  static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  async list() {
    return listCategories();
  }
}
