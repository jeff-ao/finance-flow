import { Home, BarChart3, CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export function BottomDock({
  activeTab,
  onTabChange,
  onAddClick,
}: BottomDockProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Início" },
    { id: "stats", icon: BarChart3, label: "Relatórios" },
    // { id: "cards", icon: CreditCard, label: "Cartões" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-card/95 backdrop-blur-lg rounded-full border-2 border-border shadow-lg p-2 flex items-center justify-around">
        {tabs.slice(0, 2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id !== "stats") {
                onTabChange(tab.id);
              }
            }}
            className={cn(
              "p-3 rounded-full transition-all hover:scale-105",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground hover:bg-blue-500"
                : "text-muted-foreground hover:bg-secondary"
            )}
            aria-label={tab.label}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}

        <button
          onClick={onAddClick}
          className="p-4 bg-primary hover:bg-blue-500 text-primary-foreground rounded-full transition-all transform hover:scale-105 shadow-lg"
          aria-label="Adicionar transação"
        >
          <Plus className="w-6 h-6" />
        </button>

        {tabs.slice(2).map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "p-3 rounded-full transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            )}
            aria-label={tab.label}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
