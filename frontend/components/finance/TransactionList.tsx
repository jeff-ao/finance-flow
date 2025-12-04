import { useState } from "react";
import { Transaction, TransactionType } from "@/types/finance";
import { TransactionItem } from "./TransactionItem";
import { Eye, EyeOff, Filter, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "../LucideIcons";

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
}

type FilterType = "all" | "income" | "expense";

export function TransactionList({
  transactions,
  onTransactionClick,
  onDeleteTransaction,
}: TransactionListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const cycleFilter = () => {
    if (filter === "all") setFilter("income");
    else if (filter === "income") setFilter("expense");
    else setFilter("all");
  };

  const getFilterLabel = () => {
    if (filter === "all") return "Todos";
    if (filter === "income") return "Entradas";
    return "Saídas";
  };

  return (
    <div
      className="bg-card rounded-2xl shadow-card p-4 lg:p-6 animate-fade-in"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="font-semibold text-foreground text-lg">Transações</h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleFilter}
            className={cn(
              "text-xs gap-1.5 rounded-full",
              filter === "income" && "text-income border-income/30 bg-income/5",
              filter === "expense" &&
                "text-expense border-expense/30 bg-expense/5"
            )}
          >
            <Filter className="w-3 h-3" />
            {getFilterLabel()}
          </Button>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmpty(!showEmpty)}
            className="h-8 w-8 rounded-full"
          >
            {showEmpty ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button> */}
        </div>
      </div>

      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <TransactionItem
                transaction={transaction}
                onClick={onTransactionClick}
                onDelete={onDeleteTransaction}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </div>

      {/* Desktop View - Modern Table */}
      <div className="hidden lg:block">
        {sortedTransactions.length > 0 ? (
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
                  <TableHead className="font-semibold text-foreground">
                    Descrição
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Categoria
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Data
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-right">
                    Valor
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction, index) => {
                  const isIncome = transaction.type === "income";
                  return (
                    <TableRow
                      key={transaction.id}
                      onClick={() => onTransactionClick(transaction)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors border-border/30 animate-fade-in"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-lg">
                            {transaction.category !== null ? (
                              <LucideIcon
                                name={transaction.category.icon as any}
                              />
                            ) : (
                              "📦"
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {transaction.title}
                            </p>
                            {transaction.notes && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {transaction.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal rounded-full"
                        >
                          {transaction.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(transaction.date, "dd 'de' MMM", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={transaction.isPaid ? "default" : "outline"}
                          className={cn(
                            "rounded-full gap-1 font-normal",
                            transaction.isPaid
                              ? "bg-income/10 text-income hover:bg-income/20 border-0"
                              : "text-muted-foreground"
                          )}
                        >
                          {transaction.isPaid ? (
                            <>
                              <Check className="w-3 h-3" />
                              Pago
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pendente
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-bold",
                            isIncome ? "text-income" : "text-expense"
                          )}
                        >
                          {isIncome ? "+" : "-"}{" "}
                          {formatCurrency(transaction.value)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
