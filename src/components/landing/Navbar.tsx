"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LandingNavbar() {
  const { user, setUser } = useStore();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      setUser(null);
      router.refresh();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 px-4 sm:px-6">
      <div className="h-full flex items-center justify-between md:grid md:grid-cols-3">
        {/* Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            {/* <span className="font-semibold text-lg tracking-tight text-black hidden xs:block sm:block">
              Spendwise
            </span> */}
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-black/80">
          <Link href="#" className="hover:text-black transition-colors">
            Product
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Pricing
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Releases
          </Link>
          <Link href="#" className="hover:text-black transition-colors">
            Docs
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center justify-end gap-3 sm:gap-6 text-sm font-medium text-black/80">
          {user ? (
            <>
              <Link
                href="/"
                className="hidden sm:block hover:text-black transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="h-10 px-4 sm:px-6 bg-black text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] whitespace-nowrap"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="hidden sm:block hover:text-black transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                className="h-10 px-4 sm:px-6 bg-black text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] whitespace-nowrap"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
