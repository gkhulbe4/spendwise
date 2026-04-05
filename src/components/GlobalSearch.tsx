"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  Settings,
  Lightbulb,
  Search,
} from "lucide-react";

export function GlobalSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (
        e.key === "/" &&
        !open &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return open ? (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />
      <div className="w-full max-w-xl mx-4 rounded-2xl bg-card border border-border overflow-hidden shadow-2xl cmdk-dialog animate-in fade-in zoom-in-95 duration-200 z-10">
        <Command loop>
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex-1 h-12 bg-transparent border-0 outline-none text-foreground px-3 text-[15px] placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="flex items-center gap-1">
              <kbd className="h-5 px-1.5 flex items-center justify-center rounded bg-muted border border-border text-[10px] font-medium text-muted-foreground font-mono">
                ESC
              </kbd>
            </div>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Pages"
              className="text-xs font-medium text-muted-foreground px-2 py-1.5 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-semibold **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:tracking-wider **:[[cmdk-group-heading]]:uppercase"
            >
              <Command.Item
                onSelect={() => runCommand(() => router.push("/"))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 stroke-[1.5px]" />
                Dashboard
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/transactions"))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
              >
                <CreditCard className="w-4 h-4 stroke-[1.5px]" />
                Transactions
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push("/settings"))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors"
              >
                <Settings className="w-4 h-4 stroke-[1.5px]" />
                Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  ) : null;
}
