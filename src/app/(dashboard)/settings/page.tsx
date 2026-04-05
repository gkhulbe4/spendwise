"use client";

import { useState } from "react";
import {
  Users,
  Link2,
  Copy,
  Check,
  Shield,
  Eye,
  ChevronDown,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/store/useStore";
import {
  useMembersQuery,
  useUpdateMemberRole,
  useRemoveMember,
  type Member,
} from "@/hooks/use-members-query";

export default function SettingsPage() {
  const { user } = useStore();
  const { members, loading: loadingMembers } = useMembersQuery();
  const updateRoleMutation = useUpdateMemberRole();
  const removeMemberMutation = useRemoveMember();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states for role change
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState("viewer");

  // Modal states for organization removal
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInviteLink("");
    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteLink(data.inviteLink);
        setInviteEmail("");
        toast.success("Invite link generated");
      } else {
        setError(data.error || "Failed to generate invite");
        toast.error("Failed to generate invite");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const openRoleModal = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
    setRoleModalOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedMember) return;

    if (selectedMember.role === newRole) {
      toast.info(
        `User is already ${newRole === "admin" ? "an admin" : "a viewer"}!`,
      );
      setRoleModalOpen(false);
      return;
    }

    try {
      await updateRoleMutation.mutateAsync({
        id: selectedMember.id,
        role: newRole,
      });
      toast.success("Role updated successfully");
      setRoleModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to update role");
    }
  };

  const openRemoveModal = (member: Member) => {
    setMemberToRemove(member);
    setRemoveModalOpen(true);
  };

  const handleRemove = async () => {
    if (!memberToRemove || !user) return;

    // Check if user is removing themselves and is an admin
    if (memberToRemove.id === user.id && memberToRemove.role === "admin") {
      toast.error(
        "Admins cannot remove themselves. Please transfer ownership or promote another admin first.",
      );
      setRemoveModalOpen(false);
      return;
    }

    if (memberToRemove.role === "admin") {
      const adminCount = members.filter((m) => m.role === "admin").length;
      if (adminCount <= 1) {
        toast.error(
          "Cannot remove the last admin. An organization must have at least one admin.",
        );
        setRemoveModalOpen(false);
        return;
      }
    }

    try {
      await removeMemberMutation.mutateAsync(memberToRemove.id);
      toast.success("Member removed successfully");
      setRemoveModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to remove member");
    }
  };

  return (
    <div className="min-h-full bg-background text-foreground p-4 sm:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspace members and invitations
          </p>
        </div>

        {/* Invite Section */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h2 className="text-[14px] font-semibold text-card-foreground">
              Invite Member
            </h2>
          </div>

          <form
            onSubmit={handleInvite}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              required
              type="email"
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 h-9 py-2 bg-background border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 bg-background border border-border rounded-lg px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate Link"}
            </button>
          </form>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          {inviteLink && (
            <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg">
              <span className="flex-1 text-xs text-muted-foreground truncate font-mono">
                {inviteLink}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-foreground transition-colors shrink-0"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Members Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b border-border">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="text-[14px] font-semibold text-card-foreground">
              Team Members
            </h2>
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>

          {loadingMembers ? (
            <div className="divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3"
                >
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-7 w-20 rounded-md" />
                  <Skeleton className="h-7 w-7 rounded-md ml-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center flex-nowrap gap-2 sm:gap-4 px-3 sm:px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[12px] font-medium text-muted-foreground shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 break-all sm:break-normal">
                      {member.email}
                    </div>
                  </div>

                  <button
                    onClick={() => openRoleModal(member)}
                    className="h-7 bg-background border border-border rounded-md px-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="capitalize">{member.role}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>

                  <div className="flex items-center justify-center w-6">
                    {member.role === "admin" ? (
                      <Shield className="w-4 h-4 text-primary" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <button
                    onClick={() => openRemoveModal(member)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all ml-1"
                  >
                    <UserRoundX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        {roleModalOpen && selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Change Member Role
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                Update permissions for {selectedMember.name}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                    Select Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full h-10 bg-background border border-border rounded-lg px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="viewer">Viewer (Can read only)</option>
                    <option value="admin">Admin (Full access)</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <button
                    onClick={() => setRoleModalOpen(false)}
                    className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRoleChange}
                    className="h-9 px-4 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove Member Modal */}
        {removeModalOpen && memberToRemove && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Remove Member
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-foreground">
                  {memberToRemove.name}
                </span>{" "}
                from the organization? They will lose all access immediately.
              </p>
              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-4">
                <button
                  onClick={() => setRemoveModalOpen(false)}
                  className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  className="h-9 px-4 text-sm font-medium bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors"
                >
                  Yes, remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
