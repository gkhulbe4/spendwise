"use client";

import { useStore } from "@/store/useStore";
import { useTransactionsFetch } from "@/hooks/use-transactions";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { TransactionModal } from "@/components/TransactionModal";
import { format } from "date-fns";
import { Transaction } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function TransactionsPage() {
  const { loading } = useTransactionsFetch();
  const { transactions, role, removeTransaction } = useStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, search, filterType]);

  const handleEdit = (t: Transaction) => {
    if (role === "viewer") return;
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (role === "viewer") return;
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        removeTransaction(id);
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const openNewModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage all your company expenses and income.</p>
        </div>
        
        <button
          onClick={openNewModal}
          disabled={role === "viewer"}
          title={role === "viewer" ? "Admin access required" : undefined}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full flex h-10 rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex h-10 w-full sm:w-40 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="all">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading transactions...</td>
                 </tr>
              ) : filtered.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No transactions found. add your first expense.</td>
                 </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(t.date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {t.title}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span className={t.type === "expense" ? "text-foreground" : "text-emerald-500"}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                        t.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        t.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                        "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(t)}
                          disabled={role === "viewer"}
                          title={role === "viewer" ? "Admin access required" : "Edit"}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          disabled={role === "viewer"}
                          title={role === "viewer" ? "Admin access required" : "Delete"}
                          className="p-1 text-muted-foreground hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={editingTransaction} 
      />
    </div>
  );
}
