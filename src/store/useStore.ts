import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Transaction } from "@prisma/client";

export type Role = "admin" | "viewer";

interface FilterState {
  search: string;
  category: string;
  type: string;
  status: string;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  orgName?: string;
  memberships?: {
    orgId: string;
    orgName: string;
    role: Role;
  }[];
}

interface AppState {
  user: UserData | null;
  setUser: (user: UserData | null) => void;

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
      user: null,
      setUser: (user) => set({ user }),

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
      partialize: (state) => ({}), // Don't persist user data in localStorage (Security)
    }
  )
);
