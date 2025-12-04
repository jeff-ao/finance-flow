"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Transaction, MonthlySummary } from "@/types/finance";
import { SummaryCards } from "@/components/finance/SummaryCards";
import { MonthSelector } from "@/components/finance/MonthSelector";
import { TransactionList } from "@/components/finance/TransactionList";
import { TransactionModal } from "@/components/finance/TransactionModal";
import { BottomDock } from "@/components/finance/BottomDock";
import { Button } from "@/components/ui/button";
import {
  authService,
  transactionService,
  categoryService,
} from "@/lib/services";
import { toast } from "sonner";
import type { Category as APICategory } from "@/lib/schemas";
import { LogOut } from "lucide-react";
import { AxiosError } from "axios";

export default function Home() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Verifica autenticação
  useEffect(() => {
    const token = authService.getStoredToken();
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // Carrega categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.list();
        setCategories(data);
      } catch (error) {
        toast.error("Erro ao carregar categorias");
      }
    };
    loadCategories();
  }, []);

  // Carrega transações
  const loadTransactions = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await transactionService.list({
        month: selectedMonth + 1, // API usa 1-12
        year: selectedYear,
        page,
        limit: 50,
      });

      // Converte os dados da API para o formato do frontend
      const mappedTransactions: Transaction[] = response.data.map((t) => ({
        id: t.id.toString(),
        title: t.title,
        value: typeof t.value === "string" ? parseFloat(t.value) : t.value,
        type: t.type === "INPUT" ? "income" : "expense",
        date: new Date(t.date),
        isPaid: t.status === "PAID",
        category: t.category
          ? {
              id: t.category.id.toString(),
              name: t.category.name,
              icon: t.category.webDeviceIcon || "📦",
            }
          : { id: "0", name: "Sem categoria", icon: "📦" },
        notes: undefined,
      }));

      setTransactions(mappedTransactions);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalTransactions(response.pagination.total);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error("Erro ao carregar transações");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadTransactions(1);
  }, [selectedMonth, selectedYear]);

  // Filtra transações já carregadas (já vêm filtradas do backend)
  const filteredTransactions = transactions;

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

  const handleSaveTransaction = async (
    newTransaction: Omit<Transaction, "id">
  ) => {
    try {
      const categoryId = newTransaction.category?.id
        ? parseInt(newTransaction.category.id)
        : undefined;

      if (editingTransaction) {
        // Update existing
        await transactionService.update(parseInt(editingTransaction.id), {
          title: newTransaction.title,
          value: newTransaction.value,
          date: newTransaction.date.toISOString(),
          type: newTransaction.type === "income" ? "INPUT" : "OUTPUT",
          status: newTransaction.isPaid ? "PAID" : "PENDING",
          category_id: categoryId,
        });
        toast.success("Transação atualizada com sucesso!");
        setIsModalOpen(false);
        setEditingTransaction(null);
      } else {
        // Add new
        await transactionService.create({
          title: newTransaction.title,
          value: newTransaction.value,
          date: newTransaction.date.toISOString(),
          type: newTransaction.type === "income" ? "INPUT" : "OUTPUT",
          status: newTransaction.isPaid ? "PAID" : "PENDING",
          category_id: categoryId,
        });
        toast.success("Transação criada com sucesso!");
        // Não fecha o modal aqui - deixa o TransactionModal controlar
      }

      // Recarrega as transações
      await loadTransactions();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.error("aqui: ", error);
        toast.error(error.response?.data?.error);
        return;
      }
      toast.error(error.response?.data?.message || "Erro ao salvar transação");
    }
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    try {
      await transactionService.delete(parseInt(transaction.id));
      toast.success("Transação deletada com sucesso!");
      await loadTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao deletar transação");
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Logout realizado com sucesso!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-[1000px] mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between animate-fade-in">
          <h1 className="text-xl font-bold text-foreground">Finance Flow</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
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
          onDeleteTransaction={handleDeleteTransaction}
        />

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} ({totalTransactions}{" "}
              transações)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTransactions(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadTransactions(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Dock Navigation */}
      <BottomDock
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={handleAddClick}
      />

      {/* Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
