"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/hooks/use-user-query";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthChoice } from "@/components/auth/AuthChoice";
import { AuthForm } from "@/components/auth/AuthForm";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice");
  const [error, setError] = useState("");
  const router = useRouter();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const loading = loginMutation.isPending || registerMutation.isPending;

  const handleAuthSubmit = async (formData: any) => {
    setError("");
    try {
      if (mode === "login") {
        await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          orgId: formData.orgId,
        });
      } else if (mode === "register") {
        await registerMutation.mutateAsync(formData);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || (mode === "login" ? "Login failed" : "Registration failed"));
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 selection:bg-primary/20",
      "font-gabarito" // Maintain the marketing font for Auth
    )}>
      <div className="w-full max-w-md">
        
        <AuthHeader />

        {mode === "choice" ? (
          <AuthChoice 
            onSelect={(newMode) => {
              setMode(newMode);
              setError("");
            }}
            onBack={() => router.push("/landing")}
          />
        ) : (
          <AuthForm 
            mode={mode as "login" | "register"}
            loading={loading}
            error={error}
            onSubmit={handleAuthSubmit}
            onBack={() => {
              setMode("choice");
              setError("");
            }}
          />
        )}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
