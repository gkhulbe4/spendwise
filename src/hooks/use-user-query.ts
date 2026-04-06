import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore, UserData } from "@/store/useStore";

export const userKeys = {
  all: ["session"] as const,
};

async function fetchSession(): Promise<UserData | null> {
  const res = await fetch("/api/auth/session");
  if (!res.ok) return null;
  return res.json();
}

export function useUserQuery() {
  const { setUser } = useStore();
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const data = await fetchSession();
      if (data) setUser(data);
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useSwitchOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orgId: string) => {
      const res = await fetch("/api/auth/switch-org", {
        method: "POST",
        body: JSON.stringify({ orgId }),
      });
      if (!res.ok) throw new Error("Failed to switch organization");
      return res.json();
    },
    onSuccess: () => {
      // Hard reload usually handled in-component for this app's architecture
    },
  });
}

export function useCreateOrg() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orgName: string) => {
      const res = await fetch("/api/auth/create-org", {
        method: "POST",
        body: JSON.stringify({ orgName }),
      });
      if (!res.ok) throw new Error("Failed to create organization");
      return res.json();
    },
    onSuccess: () => {
      // Hard reload usually handled in-component
    },
  });
}

export function useLogout() {
  const { setUser, setTransactions } = useStore();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      setUser(null);
      setTransactions([]);
    },
  });
}

export function useLogin() {
  const { setUser } = useStore();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });
}

export function useRegister() {
  const { setUser } = useStore();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });
}
