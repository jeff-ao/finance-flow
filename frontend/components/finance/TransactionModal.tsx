import { useState, useEffect } from "react";
import { Transaction, TransactionType, Category } from "@/types/finance";
import { categoryService } from "@/lib/services";
import type { Category as APICategory } from "@/lib/schemas";
import { format } from "date-fns";
import {
  CalendarIcon,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "../LucideIcons";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, "id">) => void;
  onDelete?: (transaction: Transaction) => void;
  editingTransaction?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingTransaction,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isPaid, setIsPaid] = useState(true);
  const [notes, setNotes] = useState("");
  const [addAnother, setAddAnother] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Carrega categorias
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryService.list();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setValue(editingTransaction.value.toString());
      setCategoryId(editingTransaction.category.id);
      setDate(editingTransaction.date);
      setIsPaid(editingTransaction.isPaid);
      setNotes(editingTransaction.notes || "");
    } else {
      resetForm();
    }
  }, [editingTransaction, isOpen]);

  const resetForm = () => {
    setType("expense");
    setTitle("");
    setValue("");
    setCategoryId("");
    setDate(new Date());
    setIsPaid(true);
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategory = categories.find(
      (c) => c.id.toString() === categoryId
    );
    if (!title || !value || !categoryId) return;

    onSave({
      title,
      value: parseFloat(value),
      type,
      category: selectedCategory
        ? {
            id: selectedCategory.id.toString(),
            name: selectedCategory.name,
            icon: selectedCategory.webDeviceIcon || "📦",
          }
        : { id: "0", name: "Sem categoria", icon: "📦" },
      date,
      isPaid,
      notes: notes || undefined,
    });

    if (addAnother) {
      // Reseta o formulário para cadastrar outra transação
      resetForm();
    } else {
      // Fecha o modal apenas se não for para cadastrar mais
      onClose();
    }
  };

  const handleDelete = () => {
    if (editingTransaction && onDelete) {
      onDelete(editingTransaction);
      setShowDeleteDialog(false);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[100dvh] sm:max-h-screen p-0 gap-0 overflow-y-hidden overflow-x-hidden max-w-lg w-full">
          {/* Header with gradient */}
          <div
            className={cn(
              "px-4 sm:px-6 py-6 sm:py-8 text-center",
              type === "income"
                ? "bg-gradient-to-br from-income/20 via-income/10 to-transparent"
                : "bg-gradient-to-br from-expense/20 via-expense/10 to-transparent"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center",
                type === "income" ? "bg-income/20" : "bg-expense/20"
              )}
            >
              <Wallet
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8",
                  type === "income" ? "text-income" : "text-expense"
                )}
              />
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold">
              {editingTransaction ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1 text-sm">
              {editingTransaction
                ? "Atualize os dados da transação"
                : "Registre uma nova movimentação"}
            </DialogDescription>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:px-6 space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(100vh-220px)]"
          >
            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setType("income")}
                className={cn(
                  "flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium transition-all border-2",
                  type === "income"
                    ? "bg-income/10 border-income text-income"
                    : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType("expense")}
                className={cn(
                  "flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium transition-all border-2",
                  type === "expense"
                    ? "bg-expense/10 border-expense text-expense"
                    : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <TrendingDown className="w-4 h-4" />
                Saída
              </button>
            </div>

            {/* Value - Prominent field */}
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium">
                Valor <span className="text-expense">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-base sm:text-lg">
                  R$
                </span>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-xl sm:text-2xl font-bold rounded-xl border-2 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Descrição <span className="text-expense">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex: Almoço, Salário, Uber..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary text-base"
                required
              />
            </div>

            {/* Category & Date Row */}
            <div className="gap-3 flex flex-row justify-between align-center">
              <div className="space-y-2 w-full ">
                <Label className="text-sm font-medium">
                  Categoria <span className="text-expense">*</span>
                </Label>
                {loadingCategories ? (
                  <Skeleton className="h-11 sm:h-12 rounded-xl" />
                ) : (
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                    required
                  >
                    <SelectTrigger className="h-11 sm:h-12 rounded-xl border-2 focus:border-primary text-base">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                          className="rounded-lg text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <span>
                              {category.webDeviceIcon !== null ? (
                                <LucideIcon
                                  name={category.webDeviceIcon as any}
                                />
                              ) : (
                                "📦"
                              )}
                            </span>
                            <span>{category.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2 w">
                <Label className="text-sm font-medium">
                  Data <span className="text-expense">*</span>
                </Label>
                {/* <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" /> */}
                <Input
                  type="date"
                  value={format(date, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value
                      .split("-")
                      .map(Number);
                    setDate(new Date(year, month - 1, day));
                  }}
                  className="h-[44px]  rounded-xl border-2 focus:border-primary text-sm"
                  required
                />
              </div>
            </div>

            {/* Is Paid Toggle */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-muted/50">
              <div className="space-y-0.5">
                <Label
                  htmlFor="isPaid"
                  className="font-medium text-sm sm:text-base"
                >
                  Status do pagamento
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isPaid ? "Já foi pago/recebido" : "Ainda pendente"}
                </p>
              </div>
              <Switch
                id="isPaid"
                checked={isPaid}
                onCheckedChange={setIsPaid}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Observação
              </Label>
              <Textarea
                id="notes"
                placeholder="Adicione uma nota opcional..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="rounded-xl border-2 focus:border-primary resize-none text-base"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 gap-2">
              {editingTransaction && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl h-11 sm:h-12"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deletar
                </Button>
              )}

              {!editingTransaction && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="addAnother"
                    checked={addAnother}
                    onCheckedChange={(checked) =>
                      setAddAnother(checked as boolean)
                    }
                    className="rounded"
                  />
                  <Label
                    htmlFor="addAnother"
                    className="text-sm sm:text-sm cursor-pointer text-muted-foreground"
                  >
                    Cadastrar mais
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className={cn(
                  "ml-auto px-6 sm:px-8 h-11 sm:h-12 rounded-xl font-semibold text-sm sm:text-base",
                  editingTransaction && "flex-1"
                )}
              >
                {addAnother
                  ? "Próximo"
                  : editingTransaction
                  ? "Salvar Alterações"
                  : "Adicionar"}
              </Button>
            </div>
            {/*Gambiarra pra espaçamento no mobile */}
            <div className="h-[20px] w-full bg-transparent block md:hidden">
              {" "}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a transação{" "}
              <strong>{editingTransaction?.title}</strong>? Esta ação não pode
              ser desfeita.
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
