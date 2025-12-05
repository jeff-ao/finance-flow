import { Category, Transaction } from "@/types/finance";

export const categories: Category[] = [
  { id: "1", name: "Salário", icon: "💰" },
  { id: "2", name: "Freelance", icon: "💼" },
  { id: "3", name: "Alimentação", icon: "🍔" },
  { id: "4", name: "Transporte", icon: "🚗" },
  { id: "5", name: "Lazer", icon: "🎮" },
  { id: "6", name: "Saúde", icon: "💊" },
  { id: "7", name: "Educação", icon: "📚" },
  { id: "8", name: "Moradia", icon: "🏠" },
  { id: "9", name: "Investimentos", icon: "📈" },
  { id: "10", name: "Outros", icon: "📦" },
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    value: 5000,
    type: "income",
    category: categories[0],
    date: new Date(2025, 11, 5),
    isPaid: true,
  },
  {
    id: "2",
    title: "Freelance Website",
    value: 1500000,
    type: "income",
    category: categories[1],
    date: new Date(2025, 11, 10),
    isPaid: true,
  },
  {
    id: "3",
    title: "Supermercado",
    value: 450,
    type: "expense",
    category: categories[2],
    date: new Date(2025, 11, 3),
    isPaid: true,
  },
  {
    id: "4",
    title: "Uber",
    value: 85.5,
    type: "expense",
    category: categories[3],
    date: new Date(2025, 11, 4),
    isPaid: true,
  },
  {
    id: "5",
    title: "Cinema",
    value: 44.5,
    type: "expense",
    category: categories[4],
    date: new Date(2025, 11, 8),
    isPaid: true,
  },
  {
    id: "6",
    title: "Farmácia",
    value: 120,
    type: "expense",
    category: categories[5],
    date: new Date(2025, 11, 2),
    isPaid: true,
  },
  {
    id: "7",
    title: "Curso Online",
    value: 199,
    type: "expense",
    category: categories[6],
    date: new Date(2025, 11, 1),
    isPaid: false,
  },
  {
    id: "8",
    title: "Aluguel",
    value: 1800,
    type: "expense",
    category: categories[7],
    date: new Date(2025, 11, 5),
    isPaid: true,
  },
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatCurrencyCompact = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1000000) {
    // 1 milhão ou mais -> 1mi, 1.5mi
    const millions = value / 1000000;
    return `R$ ${millions.toFixed(millions >= 10 ? 0 : 1)}mi`;
  } else if (absValue >= 1000) {
    // 1 mil ou mais -> 1mil, 1.5mil
    const thousands = value / 1000;
    return `R$ ${thousands.toFixed(thousands >= 10 ? 0 : 1)}mil`;
  }

  // Valores menores que 1000 -> formato normal
  return formatCurrency(value);
};

export const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const monthsFull = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
