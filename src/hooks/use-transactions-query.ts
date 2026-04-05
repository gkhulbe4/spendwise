import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import { Transaction } from "@prisma/client";

// Query key factory for consistency
export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
};

// Fetch helper with date parsing
async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch("/api/transactions");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data = await res.json();
  data.forEach((t: any) => {
    t.date = new Date(t.date);
    t.createdAt = new Date(t.createdAt);
    t.updatedAt = new Date(t.updatedAt);
  });
  return data;
}

/**
 * Hook to fetch and cache transactions using TanStack Query.
 * Also syncs data into Zustand store for cross-component access.
 */
export function useTransactionsQuery() {
  const { setTransactions } = useStore();

  const query = useQuery({
    queryKey: transactionKeys.list(),
    queryFn: async () => {
      const data = await fetchTransactions();
      setTransactions(data); // Keep Zustand in sync for components that use it directly
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    transactions: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Payload type for creating/updating transactions (date is a string from the form)
type TransactionPayload = {
  title: string;
  amount: number;
  category: string;
  type: string;
  status: string;
  date: string;
};

// --- Mutation: Create Transaction ---
async function createTransaction(payload: TransactionPayload) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create transaction");
  }
  const saved = await res.json();
  saved.date = new Date(saved.date);
  saved.createdAt = new Date(saved.createdAt);
  saved.updatedAt = new Date(saved.updatedAt);
  return saved as Transaction;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { addTransaction } = useStore();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (saved) => {
      addTransaction(saved); // Optimistically update Zustand
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

// --- Mutation: Update Transaction ---
async function updateTransactionApi({
  id,
  payload,
}: {
  id: string;
  payload: TransactionPayload;
}) {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update transaction");
  }
  const saved = await res.json();
  saved.date = new Date(saved.date);
  saved.createdAt = new Date(saved.createdAt);
  saved.updatedAt = new Date(saved.updatedAt);
  return saved as Transaction;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { updateTransaction } = useStore();

  return useMutation({
    mutationFn: updateTransactionApi,
    onSuccess: (saved) => {
      updateTransaction(saved); // Keep Zustand in sync
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

// --- Mutation: Delete Transaction ---
async function deleteTransactionApi(id: string) {
  const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to delete transaction");
  }
  return id;
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { removeTransaction } = useStore();

  return useMutation({
    mutationFn: deleteTransactionApi,
    onSuccess: (id) => {
      removeTransaction(id); // Keep Zustand in sync
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

// --- Mutation: Bulk Delete Transactions ---
async function bulkDeleteTransactionsApi(ids: string[]) {
  // Execute in parallel for speed
  const results = await Promise.all(
    ids.map((id) =>
      fetch(`/api/transactions/${id}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to delete transaction ${id}`);
        }
        return id;
      }),
    ),
  );
  return results;
}

export function useBulkDeleteTransactions() {
  const queryClient = useQueryClient();
  const { setTransactions, transactions } = useStore();

  return useMutation({
    mutationFn: bulkDeleteTransactionsApi,
    onSuccess: (deletedIds) => {
      // Batch update Zustand
      setTransactions(transactions.filter((t) => !deletedIds.includes(t.id)));
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}
