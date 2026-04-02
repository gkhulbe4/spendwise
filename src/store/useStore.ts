import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction } from "@prisma/client";

export type Role = "admin" | "viewer";

interface FilterState {
  search: string;
  category: string;
  type: string;
  status: string;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface AppState {
  role: Role;
  setRole: (role: Role) => void;

  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
}

const initialFilters: FilterState = {
  search: "",
  category: "all",
  type: "all",
  status: "all",
  sortBy: "date",
  sortOrder: "desc",
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: "viewer", // default role
      setRole: (role) => set({ role }),

      filters: initialFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: initialFilters }),

      transactions: [],
      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      updateTransaction: (updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === updated.id ? updated : t
          ),
        })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "spendwise-storage",
      partialize: (state) => ({ role: state.role }), // only persist role
    }
  )
);
