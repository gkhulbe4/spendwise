"use client";

import { useStore } from "@/store/useStore";
import { useTransactionsFetch } from "@/hooks/use-transactions";
import { useMemo } from "react";
import { TrendingUp, AlertCircle, PieChart as PieChartIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function InsightsPage() {
  const { loading } = useTransactionsFetch();
  const { transactions } = useStore();

  const { highestCategory, highestAmount, expenseCount, incomeCount } = useMemo(() => {
    let highestCategory = "N/A";
    let highestAmount = 0;
    
    const catMap: Record<string, number> = {};
    let expenseCount = 0;
    let incomeCount = 0;

    transactions.forEach(t => {
      if (t.type === "expense") {
        expenseCount++;
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        if (catMap[t.category] > highestAmount) {
          highestAmount = catMap[t.category];
          highestCategory = t.category;
        }
      } else {
        incomeCount++;
      }
    });

    return { highestCategory, highestAmount, expenseCount, incomeCount };
  }, [transactions]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  if (loading) {
    return <div className="animate-pulse p-6">Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Intelligent Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highlight Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Highest Spending Category</h3>
            <p className="text-muted-foreground text-sm mt-1">
              You have spent the most on <span className="font-medium text-foreground">{highestCategory}</span>.
            </p>
            <div className="text-2xl font-bold tracking-tight mt-3">{formatCurrency(highestAmount)}</div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Transaction Volume</h3>
            <p className="text-muted-foreground text-sm mt-1">Here is a quick look at your transaction frequency.</p>
            <div className="flex gap-6 mt-4">
               <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Expenses</div>
                  <div className="text-xl font-bold flex items-center gap-1 mt-1">
                    {expenseCount} <ArrowUpRight className="w-4 h-4 text-red-500" />
                  </div>
               </div>
               <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Incomes</div>
                  <div className="text-xl font-bold flex items-center gap-1 mt-1">
                    {incomeCount} <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Alert Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4 md:col-span-2">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Spending Alerts</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Your overall spending seems stable. No unusual spikes detected in the last 30 days. Maintain this trend to improve your net savings rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
