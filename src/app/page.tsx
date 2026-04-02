"use client";

import { useStore } from "@/store/useStore";
import { useTransactionsFetch } from "@/hooks/use-transactions";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { useMemo } from "react";
import { format, subDays, isAfter } from "date-fns";

export default function DashboardPage() {
  const { loading } = useTransactionsFetch();
  const { transactions } = useStore();

  const { income, expenses, balance, savingsRate } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.status === "approved" || t.status === "pending") {
        if (t.type === "income") income += t.amount;
        if (t.type === "expense") expenses += t.amount;
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
    const recent = transactions.filter(t => isAfter(t.date, thirtyDaysAgo) && t.type === "expense");
    
    // Group by day for the chart
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

  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#0677fd', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0f2fe'];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        />
        <Card
          title="Total Expenses"
          value={formatCurrency(expenses)}
          icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
          trend="-4%"
        />
        <Card
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<DollarSign className="w-4 h-4 text-primary" />}
          trend="+1.2%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">
            Expenses Over Time (Last 30 Days)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0677fd" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0677fd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
                <Area type="monotone" dataKey="amount" stroke="#0677fd" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Donut Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-6">Expenses By Category</h3>
          <div className="h-[300px] flex justify-center items-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                    itemStyle={{ color: "var(--foreground)" }}
                    formatter={(value: any) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No expenses yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">{icon}</div>
      </div>
      <div>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center text-xs">
          <span className={isPositive ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>{trend}</span>
          <span className="text-muted-foreground ml-1">vs last month</span>
        </div>
      </div>
    </div>
  );
}
