"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Transaction } from "@prisma/client";
import { useStore } from "@/store/useStore";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const { addTransaction, updateTransaction } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Misc",
    type: "expense",
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        status: transaction.status,
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        amount: "",
        category: "Misc",
        type: "expense",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setError("");
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      
      let res;
      if (transaction) {
        res = await fetch(`/api/transactions/${transaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error("Failed to save transaction");
      }

      const saved = await res.json();
      saved.date = new Date(saved.date);
      saved.createdAt = new Date(saved.createdAt);
      saved.updatedAt = new Date(saved.updatedAt);

      if (transaction) {
        updateTransaction(saved);
      } else {
        addTransaction(saved);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">{transaction ? "Edit Transaction" : "New Transaction"}</h2>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-lg">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              placeholder="e.g., Software subscription"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Amount</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="Salary">Salary</option>
                <option value="Marketing">Marketing</option>
                <option value="Tools">Tools</option>
                <option value="Travel">Travel</option>
                <option value="Office">Office</option>
                <option value="Misc">Misc</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
