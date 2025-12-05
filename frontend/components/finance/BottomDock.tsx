import { Home, BarChart3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface BottomDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface DisabledTabButtonProps {
  icon: LucideIcon;
  label: string;
  tooltipText: string;
}

function TabButton({ icon: Icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-full transition-all hover:scale-105",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-blue-500"
          : "text-muted-foreground hover:bg-secondary"
      )}
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

function DisabledTabButton({
  icon: Icon,
  label,
  tooltipText,
}: DisabledTabButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="p-3 rounded-full cursor-not-allowed opacity-60 text-muted-foreground"
          aria-label={label}
        >
          <Icon className="w-5 h-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function BottomDock({
  activeTab,
  onTabChange,
  onAddClick,
}: BottomDockProps) {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-card/95 backdrop-blur-lg rounded-full border-2 border-border shadow-lg p-2 flex items-center justify-around">
          <TabButton
            icon={Home}
            label="Início"
            isActive={activeTab === "home"}
            onClick={() => onTabChange("home")}
          />

          <DisabledTabButton
            icon={BarChart3}
            label="Relatórios"
            tooltipText="Em Breve"
          />

          <button
            onClick={onAddClick}
            className="p-4 bg-primary hover:bg-blue-500 text-primary-foreground rounded-full transition-all transform hover:scale-105 shadow-lg"
            aria-label="Adicionar transação"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}
