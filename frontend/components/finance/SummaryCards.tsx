import { MonthlySummary } from '@/types/finance';
import { formatCurrency } from '@/data/mockData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryCardsProps {
  summary: MonthlySummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-income-light rounded-lg p-3 cursor-help transition-all hover:shadow-card-hover animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-income" />
              <span className="text-xs text-muted-foreground font-medium">Receitas</span>
            </div>
            <p className="text-income font-bold text-sm sm:text-base truncate">
              {formatCurrency(summary.income)}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Quanto entrou esse mês</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-expense-light rounded-lg p-3 cursor-help transition-all hover:shadow-card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-expense" />
              <span className="text-xs text-muted-foreground font-medium">Despesas</span>
            </div>
            <p className="text-expense font-bold text-sm sm:text-base truncate">
              {formatCurrency(summary.expenses)}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Quanto saiu esse mês</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-balance-light rounded-lg p-3 cursor-help transition-all hover:shadow-card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground font-medium">Saldo</span>
            </div>
            <p className={`font-bold text-sm sm:text-base truncate ${summary.balance >= 0 ? 'text-income' : 'text-expense'}`}>
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Diferença desse mês (lucro)</p>
        </TooltipContent>
      </Tooltip>
    </div>
    </TooltipProvider>
  );
}
