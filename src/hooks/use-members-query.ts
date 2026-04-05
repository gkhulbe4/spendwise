import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export const memberKeys = {
  all: ["members"] as const,
  list: () => [...memberKeys.all, "list"] as const,
};

async function fetchMembers(): Promise<Member[]> {
  const res = await fetch("/api/members");
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export function useMembersQuery() {
  const query = useQuery({
    queryKey: memberKeys.list(),
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5, // 5 minutes — members change less frequently
  });

  return {
    members: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// --- Mutation: Update Role ---
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.list() });
    },
  });
}

// --- Mutation: Remove Member ---
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.list() });
    },
  });
}
