"use client";

import { useState } from "react";
import { Transaction } from "@/types/finance";
import { formatCurrency } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LucideIcon } from "../LucideIcons";

interface TransactionItemProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  onClick,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.type === "income";
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // Limita o arrasto apenas para a esquerda
    if (diff < 0) {
      setDragX(Math.max(diff, -100));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Se arrastou mais de 60px, mostra o dialog de confirmação
    if (dragX < -60) {
      setShowDeleteDialog(true);
    }

    // Reseta a posição
    setDragX(0);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction);
    }
    setShowDeleteDialog(false);
  };

  console.log(transaction.category);

  return (
    <>
      <div className="relative overflow-hidden rounded-lg">
        {/* Background de delete */}
        <div className="absolute inset-0 bg-destructive flex items-center justify-end px-6 rounded-lg">
          <Trash2 className="w-5 h-5 text-destructive-foreground" />
        </div>

        {/* Card da transação */}
        <button
          onClick={() => !isDragging && onClick(transaction)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          className="w-full flex items-center gap-3 p-3 bg-card rounded-lg shadow-card hover:shadow-card-hover transition-shadow text-left group relative"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
            {transaction.category.id !== "0" ? (
              <LucideIcon name={transaction.category.icon as any} />
            ) : (
              "📦"
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {transaction.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{format(transaction.date, "dd/MM", { locale: ptBR })}</span>
              <span>•</span>
              <span>{transaction.category.name}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "font-bold text-sm",
                isIncome ? "text-income" : "text-expense"
              )}
            >
              {isIncome ? "+" : "-"} {formatCurrency(transaction.value)}
            </span>

            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                transaction.isPaid ? "text-income" : "text-muted-foreground"
              )}
            >
              {transaction.isPaid ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Pago</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Pendente</span>
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Dialog de confirmação */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a transação{" "}
              <strong>{transaction.title}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
