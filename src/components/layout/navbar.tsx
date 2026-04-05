"use client";

import { usePathname } from "next/navigation";
import { User, History, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "@/components/layout/sidebar";

export function Navbar() {
  const pathname = usePathname();

  const title =
    pathname === "/" ? "Dashboard" : pathname.split("/").filter(Boolean).pop();
  const formattedTitle = title
    ? title.charAt(0).toUpperCase() + title.slice(1)
    : "Dashboard";

  return (
    <header className="h-[52px] flex items-center justify-between px-6 border-b border-border bg-background shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-3 text-foreground">
        <MobileDrawer />
        <div className="flex items-center gap-2 font-medium text-[14px]">
          <User className="hidden sm:block w-4 h-4 stroke-[1.5px] text-muted-foreground" />
          <span>{formattedTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground text-[13px] font-medium">
        <div className="w-px h-4 bg-border mx-1" />

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Work-in-progress
          </span>
        </div>
      </div>
    </header>
  );
}
