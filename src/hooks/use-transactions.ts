import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export function useTransactionsFetch() {
  const { transactions, setTransactions } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          // parse dates
          data.forEach((t: any) => {
            t.date = new Date(t.date);
            t.createdAt = new Date(t.createdAt);
            t.updatedAt = new Date(t.updatedAt);
          });
          setTransactions(data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if empty, or you could implement better caching
    if (transactions.length === 0) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [setTransactions, transactions.length]);

  return { loading };
}
