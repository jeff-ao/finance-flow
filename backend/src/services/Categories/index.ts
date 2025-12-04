import { listCategories } from "./list/index.js";
import { createCategory } from "./create/index.js";

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

  async create(data: { name: string; webDeviceIcon?: string }) {
    return createCategory(data);
  }
}
