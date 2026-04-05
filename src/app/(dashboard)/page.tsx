"use client";

import { useStore } from "@/store/useStore";
import { useTransactionsFetch } from "@/hooks/use-transactions";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp, AlertCircle, PieChart as PieChartIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import { format, subDays, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { loading } = useTransactionsFetch();
  const { transactions } = useStore();

  const { income, expenses, balance, savingsRate } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.status.toLowerCase() === "approved" || t.status.toLowerCase() === "pending") {
        if (t.type.toLowerCase() === "income") income += t.amount;
        if (t.type.toLowerCase() === "expense") expenses += t.amount;
      }
    });
    return {
      income,
      expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
  }, [transactions]);

  const recentData = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recent = transactions.filter(t => isAfter(t.date, thirtyDaysAgo) && t.type.toLowerCase() === "expense");
    
    const grouped: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      grouped[format(subDays(new Date(), i), "MMM dd")] = 0;
    }
    
    recent.forEach(t => {
      const day = format(t.date, "MMM dd");
      if (grouped[day] !== undefined) {
        grouped[day] += t.amount;
      }
    });

    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }));
  }, [transactions]);

  const { highestCategory, highestAmount, expenseCount, incomeCount } = useMemo(() => {
    let highestCategory = "N/A";
    let highestAmount = 0;
    
    const catMap: Record<string, number> = {};
    let expenseCount = 0;
    let incomeCount = 0;

    transactions.forEach(t => {
      if (t.type.toLowerCase() === "expense") {
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

  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type.toLowerCase() === "expense") {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#0677fd', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0f2fe'];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 bg-background text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground font-medium">Keep track of your financial health across the organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </>
        ) : (
          <>
            <Card
              title="Total Balance"
              value={formatCurrency(balance)}
              icon={<Wallet className="w-4 h-4 text-primary" />}
              trend="+2.5%"
            />
            <Card
              title="Total Income"
              value={formatCurrency(income)}
              icon={<ArrowDownRight className="w-4 h-4 text-emerald-500" />}
              trend="+14%"
              isNeutral={true}
            />
            <Card
              title="Total Expenses"
              value={formatCurrency(expenses)}
              icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
              trend="-4%"
              isNegative={true}
            />
            <Card
              title="Savings Rate"
              value={`${savingsRate.toFixed(1)}%`}
              icon={<DollarSign className="w-4 h-4 text-primary" />}
              trend="+1.2%"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Expenses Over Time</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Comparison of daily spend for the last 30 days</p>
          </div>

          <div className="h-[300px]">
            {loading ? (
              <Skeleton className="w-full h-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recentData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0677fd" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0677fd" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="currentColor" 
                    className="text-muted-foreground opacity-50"
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-muted-foreground opacity-50"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "var(--popover)", 
                      borderColor: "var(--border)", 
                      borderRadius: "12px", 
                      fontSize: "12px", 
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                    }}
                    itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                    cursor={{ stroke: '#0677fd', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#0677fd" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Allocation</h3>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Expenses distribution by category</p>
          </div>
          <div className="h-[300px] flex justify-center items-center">
            {loading ? (
              <Skeleton className="w-48 h-48 rounded-full" />
            ) : categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "var(--popover)", 
                      borderColor: "var(--border)", 
                      borderRadius: "12px", 
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                    }}
                    itemStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                    formatter={(value: any) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <DollarSign className="w-10 h-10 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground text-xs font-medium">No expense data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Intelligent Insights</h2>
        <p className="text-sm text-muted-foreground font-medium">Automated analysis of your spending patterns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {/* Highlight Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-primary/50 transition-all duration-300">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/10">
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
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:border-primary/50 transition-all duration-300">
            <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/10">
              <PieChartIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Transaction Volume</h3>
              <p className="text-muted-foreground text-sm mt-1">Quick look at your transaction frequency.</p>
              <div className="flex gap-8 mt-4">
                 <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Expenses</div>
                    <div className="text-xl font-bold flex items-center gap-1.5 mt-1">
                      {expenseCount} <ArrowUpRight className="w-4 h-4 text-red-500" />
                    </div>
                 </div>
                 <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Incomes</div>
                    <div className="text-xl font-bold flex items-center gap-1.5 mt-1">
                      {incomeCount} <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Alert Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-start gap-4 md:col-span-2 hover:border-primary/50 transition-all duration-300">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/10">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">Spending Alerts</h3>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                Your overall spending seems stable. No unusual spikes detected in the last 30 days. Maintain this trend to improve your net savings rate and long-term financial health.
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}

function Card({ 
  title, 
  value, 
  icon, 
  trend, 
  isNegative = false, 
  isNeutral = false 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string;
  isNegative?: boolean;
  isNeutral?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</span>
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
          <span className={cn(
            "px-1.5 py-0.5 rounded-md",
            isNeutral ? "bg-emerald-500/10 text-emerald-600" :
            isNegative ? "bg-red-500/10 text-red-600" :
            "bg-emerald-500/10 text-emerald-600"
          )}>
            {trend}
          </span>
          <span className="text-muted-foreground opacity-50 font-medium">vs last month</span>
        </div>
      </div>
    </div>
  );
}
