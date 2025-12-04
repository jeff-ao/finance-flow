export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  title: string;
  value: number;
  type: TransactionType;
  category: Category;
  date: Date;
  isPaid: boolean;
  notes?: string;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
}
