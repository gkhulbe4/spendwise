"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ClaimForm({ inviteCode, email }: { inviteCode: string, email: string }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/invite/claim", {
        method: "POST",
        body: JSON.stringify({ inviteCode, name, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Claim failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleClaim} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-xs font-medium text-[#737373] mb-1.5 ml-1">Email</label>
        <input
          disabled
          value={email}
          className="w-full h-10 bg-[#0d0d0d] border border-[#262626] rounded-lg px-3 text-sm text-[#737373] outline-none opacity-60"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#a3a3a3] mb-1.5 ml-1">Full Name</label>
        <input
          required
          autoFocus
          placeholder="Jim Halpert"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 bg-[#0d0d0d] border border-[#262626] rounded-lg px-3 text-sm text-[#ededed] outline-none focus:ring-1 focus:ring-[#0677fd] transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#a3a3a3] mb-1.5 ml-1">Set Password</label>
        <input
          required
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 bg-[#0d0d0d] border border-[#262626] rounded-lg px-3 text-sm text-[#ededed] outline-none focus:ring-1 focus:ring-[#0677fd] transition-all"
        />
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full h-10 bg-[#0677fd] hover:bg-[#0566d8] text-white rounded-lg font-medium text-sm mt-4 transition-colors flex items-center justify-center disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Workspace"}
      </button>
    </form>
  );
}
