import { createRecurrence } from "./create/index.js";
import { listRecurrences } from "./list/index.js";
import { getRecurrenceById } from "./getById/index.js";
import { deleteRecurrence } from "./delete/index.js";

export class RecurrencesService {
  private static instance: RecurrencesService;

  private constructor() {}

  static getInstance(): RecurrencesService {
    if (!RecurrencesService.instance) {
      RecurrencesService.instance = new RecurrencesService();
    }
    return RecurrencesService.instance;
  }

  async create(data: Parameters<typeof createRecurrence>[0]) {
    return createRecurrence(data);
  }

  async list(filters: Parameters<typeof listRecurrences>[0]) {
    return listRecurrences(filters);
  }

  async getById(id: number, userId: number) {
    return getRecurrenceById(id, userId);
  }

  async delete(id: number, userId: number, keepHistory?: boolean) {
    return deleteRecurrence(id, userId, keepHistory);
  }
}
