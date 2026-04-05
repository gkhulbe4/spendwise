"use client";

import { Building } from "lucide-react";

export function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-10 transition-all">
      <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 group hover:rotate-3 transition-transform">
        <Building className="text-white w-7 h-7" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground uppercase leading-none">
        Spendwise
      </h1>
      <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
        Smarter Finance Operating System
      </div>
    </div>
  );
}
