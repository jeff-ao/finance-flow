import { useState } from "react";
import { months } from "@/data/mockData";
import { ChevronLeft, ChevronRight, Calendar, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthSelectorProps) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const handlePrevYear = () => onYearChange(selectedYear - 1);
  const handleNextYear = () => onYearChange(selectedYear + 1);
  
  const handleGoToToday = () => {
    onYearChange(currentYear);
    onMonthChange(currentMonth);
  };
  
  const isCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth;

  return (
    <div className="bg-card rounded-lg p-4 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevYear}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleGoToToday}
                disabled={isCurrentMonth}
                className={cn(
                  "flex items-center gap-2 transition-all group",
                  isCurrentMonth ? "cursor-default" : "cursor-pointer"
                )}
              >
                <Calendar className={cn(
                  "h-4 w-4 text-primary transition-all",
                  !isCurrentMonth && "group-hover:hidden"
                )} />
                <CalendarCheck className={cn(
                  "h-4 w-4 text-primary transition-all hidden",
                  !isCurrentMonth && "group-hover:block"
                )} />
                <span className="font-bold text-lg">{selectedYear}/{months[selectedMonth]}</span>
              </button>
            </TooltipTrigger>
            {!isCurrentMonth && (
              <TooltipContent>
                <p>Voltar para o mês atual</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextYear}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide content-center justify-center">
        {months.map((month, index) => {
          const isSelected = index === selectedMonth;
          const isCurrent =
            index === currentMonth && selectedYear === currentYear;

          return (
            <button
              key={month}
              onClick={() => onMonthChange(index)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                "hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-ring",
                isSelected && "bg-primary text-primary-foreground shadow-sm",
                !isSelected &&
                  isCurrent &&
                  "bg-accent text-accent-foreground ring-1 ring-primary/30",
                !isSelected &&
                  !isCurrent &&
                  "text-muted-foreground hover:text-foreground"
              )}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
}
