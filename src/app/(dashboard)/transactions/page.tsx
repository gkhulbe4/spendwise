"use client";

import { useStore } from "@/store/useStore";
import { useTransactionsFetch } from "@/hooks/use-transactions";
import {
  Search,
  Edit2,
  Trash2,
  CheckSquare,
  FileText,
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  DatabaseBackup,
  Filter,
  ArrowUpDown,
  Plus,
  Check,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { TransactionModal } from "@/components/TransactionModal";
import { format } from "date-fns";
import type { Transaction } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  useDeleteTransaction,
  useBulkDeleteTransactions,
} from "@/hooks/use-transactions-query";

export default function TransactionsPage() {
  const { loading } = useTransactionsFetch();
  const { transactions, user } = useStore();
  const role = user?.role || "viewer";

  const deleteMutation = useDeleteTransaction();
  const bulkDeleteMutation = useBulkDeleteTransactions();
  const isDeleting = deleteMutation.isPending || bulkDeleteMutation.isPending;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | "bulk" | null>(
    null,
  );

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (t) => t.type.toLowerCase() === typeFilter.toLowerCase(),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (t) => t.status.toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    if (sortBy === "date-desc")
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    if (sortBy === "date-asc")
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    if (sortBy === "amount-desc") result.sort((a, b) => b.amount - a.amount);
    if (sortBy === "amount-asc") result.sort((a, b) => a.amount - b.amount);
    if (sortBy === "title-asc")
      result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "title-desc")
      result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [transactions, searchQuery, typeFilter, statusFilter, sortBy]);

  const handleSort = (key: string) => {
    if (sortBy === `${key}-desc`) {
      setSortBy(`${key}-asc`);
    } else {
      setSortBy(`${key}-desc`);
    }
  };

  const handleEdit = (t: Transaction) => {
    if (role === "viewer") return;
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const confirmDelete = (id: string | "bulk") => {
    if (role === "viewer") return;
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete === "bulk") {
        await bulkDeleteMutation.mutateAsync(selectedIds);
        setSelectedIds([]);
        toast.success(`${selectedIds.length} transactions deleted`);
      } else {
        await deleteMutation.mutateAsync(itemToDelete);
        setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete));
        toast.success("Transaction deleted");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const toggleSelectAll = () => {
    if (
      selectedIds.length === filteredAndSorted.length &&
      filteredAndSorted.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSorted.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const handleExportCSV = () => {
    const headers = ["Title", "Amount", "Category", "Type", "Status", "Date"];
    const rows = filteredAndSorted.map((t) => [
      t.title.replace(/"/g, '""'),
      t.amount.toString(),
      t.category,
      t.type,
      t.status,
      format(new Date(t.date), "yyyy-MM-dd"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `spendwise_transactions_${format(new Date(), "yyyy_MM_dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-border bg-background shrink-0 select-none">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title..."
              className="h-9 w-full sm:w-64 bg-muted border border-border rounded-lg pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger>
              <button
                className={cn(
                  "flex items-center gap-1.5 h-9 px-3 text-xs font-medium rounded-lg transition-all",
                  typeFilter !== "all" || statusFilter !== "all"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Filter className="w-3.5 h-3.5" /> Filter{" "}
                {(typeFilter !== "all" || statusFilter !== "all") &&
                  `• ${(typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}`}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 px-2">
                Type
              </div>
              <button
                onClick={() => setTypeFilter("all")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  typeFilter === "all"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground",
                )}
              >
                All Transactions
              </button>
              <button
                onClick={() => setTypeFilter("Expense")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  typeFilter === "Expense"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground",
                )}
              >
                Expense
              </button>
              <button
                onClick={() => setTypeFilter("Income")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  typeFilter === "Income"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground",
                )}
              >
                Income
              </button>

              <div className="h-px bg-border my-2 mx-1" />

              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 px-2">
                Status
              </div>
              <button
                onClick={() => setStatusFilter("all")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  statusFilter === "all"
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground",
                )}
              >
                All Statuses
              </button>
              <button
                onClick={() => setStatusFilter("Pending")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  statusFilter === "Pending"
                    ? "bg-amber-500/10 text-amber-600"
                    : "hover:bg-muted text-foreground",
                )}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("Approved")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  statusFilter === "Approved"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "hover:bg-muted text-foreground",
                )}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter("Rejected")}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-md text-xs",
                  statusFilter === "Rejected"
                    ? "bg-red-500/10 text-red-600"
                    : "hover:bg-muted text-foreground",
                )}
              >
                Rejected
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => confirmDelete("bulk")}
              disabled={role === "viewer"}
              className="flex items-center gap-1.5 h-9 px-4 text-xs font-medium text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-all border border-red-500/20 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete {selectedIds.length}
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 h-9 px-4 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-lg transition-all border border-border"
          >
            <DatabaseBackup className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={openNewModal}
            disabled={role === "viewer"}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5 font-bold" /> New record
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px] text-left border-collapse min-w-[700px]">
          <thead className="text-muted-foreground font-medium border-b border-border sticky top-0 bg-background z-10">
            <tr>
              <th className="px-6 py-3.5 font-medium w-14">
                <button
                  onClick={toggleSelectAll}
                  className={cn(
                    "w-4.5 h-4.5 rounded-[4px] border flex items-center justify-center transition-all",
                    selectedIds.length === filteredAndSorted.length &&
                      filteredAndSorted.length > 0
                      ? "bg-primary border-primary text-white"
                      : "border-mute group-hover/header:border-border",
                  )}
                >
                  {selectedIds.length === filteredAndSorted.length &&
                    filteredAndSorted.length > 0 && (
                      <Check className="w-3 h-3 stroke-[3px]" />
                    )}
                  {selectedIds.length > 0 &&
                    selectedIds.length < filteredAndSorted.length && (
                      <div className="w-2 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
              </th>
              <th
                className="px-6 py-3.5 font-medium cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 stroke-[1.5px]" /> Title
                  </div>
                  {sortBy === "title-asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : sortBy === "title-desc" ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3.5 font-medium">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 stroke-[1.5px]" />{" "}
                  Type
                </div>
              </th>
              <th className="px-6 py-3.5 font-medium hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 stroke-[1.5px]" /> Category
                </div>
              </th>
              <th
                className="px-6 py-3.5 font-medium cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 stroke-[1.5px]" /> Amount
                  </div>
                  {sortBy === "amount-asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : sortBy === "amount-desc" ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3.5 font-medium hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 stroke-[1.5px]" /> Status
                </div>
              </th>
              <th
                className="px-6 py-3.5 font-medium cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 stroke-[1.5px]" /> Date
                  </div>
                  {sortBy === "date-asc" ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : sortBy === "date-desc" ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3.5 font-medium text-right w-14"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-3.5 w-14">
                    <Skeleton className="w-4.5 h-4.5 rounded-[4px]" />
                  </td>
                  <td className="px-6 py-3.5">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-3.5">
                    <Skeleton className="h-5 w-16 rounded-[4px]" />
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <Skeleton className="h-5 w-20 rounded-[4px]" />
                  </td>
                  <td className="px-6 py-3.5">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <Skeleton className="h-5 w-20 rounded-[4px]" />
                  </td>
                  <td className="px-6 py-3.5">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-3.5 w-14"></td>
                </tr>
              ))
            ) : filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-32 text-center">
                  <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                    <div className="mb-4 text-primary">
                      <DatabaseBackup className="w-16 h-16 stroke-[1px] opacity-20" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      No transactions found
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Update your filters or add a new transaction to see
                      records here.
                    </p>
                    {(searchQuery ||
                      typeFilter !== "all" ||
                      statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setTypeFilter("all");
                          setStatusFilter("all");
                          setSortBy("date-desc");
                        }}
                        className="mt-4 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((t) => (
                <tr
                  key={t.id}
                  className={cn(
                    "hover:bg-muted transition-colors group",
                    selectedIds.includes(t.id) &&
                      "bg-muted shadow-[inset_2px_0_0_0_rgb(var(--primary))]",
                  )}
                >
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => toggleSelect(t.id)}
                      className={cn(
                        "w-4.5 h-4.5 rounded-[4px] border flex items-center justify-center transition-all",
                        selectedIds.includes(t.id)
                          ? "bg-primary border-primary text-white"
                          : "border-muted group-hover:border-border",
                      )}
                    >
                      {selectedIds.includes(t.id) && (
                        <Check className="w-3 h-3 stroke-[3px]" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 font-medium text-foreground">
                    {t.title}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-muted border border-border text-muted-foreground uppercase tracking-tight">
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-bold bg-muted border border-border text-muted-foreground uppercase tracking-tight">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-foreground font-medium tabular-nums">
                    <span
                      className={
                        t.type.toLowerCase() === "expense"
                          ? "text-red-500"
                          : "text-emerald-500"
                      }
                    >
                      {t.type.toLowerCase() === "income" && "+"}
                      {t.type.toLowerCase() === "expense" && "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-bold border uppercase tracking-wider",
                        t.status.toLowerCase() === "approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : t.status.toLowerCase() === "pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20",
                      )}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground tabular-nums">
                    {format(new Date(t.date), "MMM d, yyyy, h:mm:ss a")}
                  </td>
                  <td className="px-6 py-3.5 text-right opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(t)}
                        disabled={role === "viewer"}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10 rounded-lg transition-colors border border-transparent focus:border-border"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(t.id)}
                        disabled={role === "viewer"}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent focus:border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete Transaction
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              {itemToDelete === "bulk"
                ? `these ${selectedIds.length} transactions`
                : "this transaction"}
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
