"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Settings,
  LayoutDashboard,
  CreditCard,
  Lightbulb,
  Building,
  FileText,
  Blocks,
  ChevronDown,
  Hexagon,
  Plus,
  LogOut,
  Loader2,
  Menu,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { GlobalSearch } from "@/components/GlobalSearch";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  useUserQuery,
  useSwitchOrg,
  useCreateOrg,
  useLogout,
} from "@/hooks/use-user-query";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function SidebarInner({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useStore();
  const { isLoading: loadingSession } = useUserQuery();
  const switchOrgMutation = useSwitchOrg();
  const createOrgMutation = useCreateOrg();
  const logoutMutation = useLogout();

  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target as Node)
      ) {
        setShowOrgSwitcher(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchOrg = async (orgId: string) => {
    try {
      await switchOrgMutation.mutateAsync(orgId);
      setShowOrgSwitcher(false);
      onItemClick?.();
      window.location.href = "/";
    } catch (e) {
      console.error("Switch failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/landing");
      router.refresh();
    } catch (e) {
      console.error("Logout failed");
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      await createOrgMutation.mutateAsync(newOrgName);
      setShowCreateOrgModal(false);
      setNewOrgName("");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to create org", error);
    }
  };

  const workspaceLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    {
      name: "Transactions",
      href: "/transactions",
      icon: CreditCard,
    },
  ];

  return (
    <>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      <div className="flex flex-col h-full w-full">
        <div
          className="h-14 flex items-center px-4 pt-2 pb-1 relative shrink-0"
          ref={switcherRef}
        >
          <button
            onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
            className="flex items-center gap-2 text-foreground hover:bg-muted w-full px-2 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-5 h-5 bg-primary rounded-[4px] flex items-center justify-center shrink-0">
              <Hexagon className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-semibold text-[14px] truncate">
              {user?.orgName || "Spendwise"}
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform",
                showOrgSwitcher && "rotate-180",
              )}
            />
          </button>

          {showOrgSwitcher && user?.memberships && (
            <div className="absolute top-[52px] left-4 right-4 bg-card border border-border rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Switch Workspace
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {user.memberships.map((m) => (
                  <button
                    key={m.orgId}
                    onClick={() => handleSwitchOrg(m.orgId)}
                    className={cn(
                      "w-full px-3 py-2 flex items-center gap-3 hover:bg-muted transition-colors text-left",
                      m.orgId === user.orgId ? "bg-muted" : "",
                    )}
                  >
                    <Building
                      className={cn(
                        "w-4 h-4 text-muted-foreground",
                        m.orgId === user.orgId && "text-primary",
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm text-foreground truncate",
                            m.orgId === user.orgId && "font-medium",
                          )}
                        >
                          {m.orgName}
                        </span>
                        <span className="text-[9px] font-mono bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded-full shrink-0">
                          ID: {m.orgId}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {m.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border mt-1 pt-1 mb-1 px-1">
                <button
                  onClick={() => {
                    setShowOrgSwitcher(false);
                    setShowCreateOrgModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors text-left"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create new Org</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div className="space-y-[2px]">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors group"
            >
              <Search className="w-4 h-4 stroke-[1.5px]" />
              <span>Search</span>
              <span className="ml-auto w-5 h-5 flex items-center justify-center border border-border rounded text-[10px] text-muted-foreground group-hover:border-transparent transition-colors">
                /
              </span>
            </button>

            {user?.role === "admin" && (
              <Link
                href="/settings"
                onClick={onItemClick}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors",
                  pathname === "/settings"
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Settings className="w-4 h-4 stroke-[1.5px]" />
                <span>Settings</span>
              </Link>
            )}
          </div>

          <div>
            <div className="px-3 text-[11px] font-semibold text-muted-foreground mb-1 tracking-wider uppercase">
              Workspace
            </div>
            <ul className="space-y-[2px]">
              {workspaceLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors relative",
                        isActive
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="w-4 h-4 stroke-[1.5px]" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-border p-3 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0 border border-border">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
            <AnimatedThemeToggler className="w-8 h-8 p-0" />
          </div>

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all font-medium"
          >
            {logoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 stroke-[1.5px]" />
            )}
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {showCreateOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateOrg}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Create Organization
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Set up a new workspace for your team
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                  Organization Name
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full h-10 bg-background border border-border rounded-lg px-3 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowCreateOrgModal(false)}
                className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={createOrgMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createOrgMutation.isPending}
                className="flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                {createOrgMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r border-border shrink-0 flex-col h-screen sticky top-0 bg-background text-foreground text-[13px] font-medium overflow-hidden">
      <SidebarInner />
    </aside>
  );
}

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="md:hidden p-2 -ml-2 mr-1 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="w-5 h-5 stroke-[1.5px]" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="w-[280px] rounded-none border-r border-border bg-background p-0 flex flex-col h-full focus:outline-none">
        <SidebarInner onItemClick={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
