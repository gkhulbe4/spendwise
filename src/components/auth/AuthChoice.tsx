"use client";

import { Sparkles, LogIn, ArrowRight } from "lucide-react";

interface AuthChoiceProps {
  onSelect: (mode: "login" | "register") => void;
  onBack: () => void;
}

export function AuthChoice({ onSelect, onBack }: AuthChoiceProps) {
  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={() => onSelect("register")}
        className="group relative flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all outline-none"
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-foreground leading-none">
              Create Organisation
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5 uppercase font-semibold tracking-tight">
              SET UP A NEW TEAM WORKSPACE
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
      </button>

      <button
        onClick={() => onSelect("login")}
        className="group relative flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/[0.02] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all outline-none"
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold text-foreground leading-none">
              Join Organisation
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5 uppercase font-semibold tracking-tight">
              ACCESS YOUR EXISTING WORKSPACE
            </div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </button>

      <button
        onClick={onBack}
        className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground mt-8 transition-colors flex items-center justify-center gap-2"
      >
        ← Back
      </button>
    </div>
  );
}
