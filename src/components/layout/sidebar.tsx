"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, PieChart, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Transactions", href: "/transactions", icon: List },
    { name: "Insights", href: "/insights", icon: PieChart },
  ];

  if (!mounted) return <div className="w-64 border-r border-border bg-card shrink-0 flex flex-col h-screen" />;

  return (
    <aside
      className={cn(
        "border-r border-border bg-card shrink-0 flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <span className="font-semibold text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md shrink-0" />
            Spendwise
          </span>
        )}
        {isCollapsed && <div className="w-6 h-6 bg-primary rounded-md shrink-0 mx-auto" />}
      </div>

      <div className="p-4 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
