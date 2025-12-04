"use client";

import { useState, useMemo } from "react";
import { Transaction, MonthlySummary } from "@/types/finance";
import { mockTransactions, monthsFull } from "@/data/mockData";
import { SummaryCards } from "@/components/finance/SummaryCards";
import { MonthSelector } from "@/components/finance/MonthSelector";
import { TransactionList } from "@/components/finance/TransactionList";
import { AddTransactionModal } from "@/components/finance/AddTransactionModal";
import { BottomDock } from "@/components/finance/BottomDock";

export default function Home() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate summary
  const summary: MonthlySummary = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.value, 0);

    const expenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.value, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [filteredTransactions]);

  const handleTransactionClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (newTransaction: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      // Update existing
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id ? { ...newTransaction, id: t.id } : t
        )
      );
    } else {
      // Add new
      const transaction: Transaction = {
        ...newTransaction,
        id: Date.now().toString(),
      };
      setTransactions((prev) => [...prev, transaction]);
    }
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <header className="text-start animate-fade-in">
          <h1 className="text-xl font-bold text-foreground">Finance Flow</h1>
        </header>

        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        {/* Month Selector */}
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          onTransactionClick={handleTransactionClick}
        />
      </div>

      {/* Bottom Dock Navigation */}
      <BottomDock
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={handleAddClick}
      />

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
