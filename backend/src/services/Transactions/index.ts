import { createTransaction } from "./create/index.js";
import { listTransactions } from "./list/index.js";
import { updateTransaction, UpdateScope } from "./update/index.js";

export class TransactionsService {
  private static instance: TransactionsService;

  private constructor() {}

  static getInstance(): TransactionsService {
    if (!TransactionsService.instance) {
      TransactionsService.instance = new TransactionsService();
    }
    return TransactionsService.instance;
  }

  async create(data: Parameters<typeof createTransaction>[0]) {
    return createTransaction(data);
  }

  async list(filters: Parameters<typeof listTransactions>[0]) {
    return listTransactions(filters);
  }

  async update(
    transactionId: number,
    userId: number,
    data: Parameters<typeof updateTransaction>[2],
    scope?: UpdateScope
  ) {
    return updateTransaction(transactionId, userId, data, scope);
  }
}

export { UpdateScope };
