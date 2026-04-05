"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  loading: boolean;
  error: string;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export function AuthForm({ mode, loading, error, onSubmit, onBack }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {mode === "login" ? "Sign In" : "Register"}
      </h2>
      <p className="text-xs text-muted-foreground mb-8 font-medium">
        {mode === "login"
          ? "Enter your credentials to access your dashboard"
          : "Create a new organization and start managing"}
      </p>

      {error && (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold rounded-lg uppercase text-center animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {mode === "register" && (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Organization Name
              </label>
              <input
                required
                name="orgName"
                type="text"
                value={formData.orgName}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                required
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
              />
            </div>
          </>
        )}
        {mode === "login" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Workspace ID
            </label>
            <input
              required
              name="orgId"
              type="text"
              value={formData.orgId}
              onChange={handleChange}
              placeholder="e.g. MyWorkspace"
              className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all tabular-nums"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Email
          </label>
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Password
          </label>
          <input
            required
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full h-11 bg-primary text-white rounded-xl mt-4 font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : mode === "login" ? (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Set up workspace <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          onClick={onBack}
          type="button"
          className="w-full text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest text-center"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}
