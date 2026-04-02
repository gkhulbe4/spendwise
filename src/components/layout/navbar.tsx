"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, User as UserIcon } from "lucide-react";
import { useStore, Role } from "@/store/useStore";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { role, setRole } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        {/* Breadcrumb or Search placeholder could go here */}
        <h1 className="text-sm font-medium text-muted-foreground">Spendwise Workspace</h1>
      </div>

      {mounted && (
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-muted p-1 rounded-lg">
            {(["admin", "viewer"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  role === r
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>
      )}
    </header>
  );
}
