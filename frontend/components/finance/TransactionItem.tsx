import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  
  return (
    <button
      onClick={() => onClick(transaction)}
      className="w-full flex items-center gap-3 p-3 bg-card rounded-lg shadow-card hover:shadow-card-hover transition-all text-left group"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
        {transaction.category.icon || '📦'}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {transaction.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{format(transaction.date, 'dd/MM', { locale: ptBR })}</span>
          <span>•</span>
          <span>{transaction.category.name}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <span className={cn(
          "font-bold text-sm",
          isIncome ? "text-income" : "text-expense"
        )}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.value)}
        </span>
        
        <div className={cn(
          "flex items-center gap-1 text-xs",
          transaction.isPaid ? "text-income" : "text-muted-foreground"
        )}>
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
  );
}
