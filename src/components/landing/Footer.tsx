"use client";

import Link from "next/link";
import { GitBranch, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white pt-24 pb-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-20">
        <div className="max-w-xs space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-3xl">SP</span>
            </div>
            {/* <span className="font-semibold text-lg tracking-tight text-black">
              Spendwise
            </span> */}
          </div>
          <p className="text-sm text-[#b2b2b2] font-medium">
            The #1 Open-Source financial OS for modern teams.
          </p>
        </div>

        <div className="flex flex-wrap gap-16 md:gap-24 uppercase font-bold text-[10px] tracking-widest text-[#b2b2b2]">
          <div className="flex flex-col gap-3">
            <span className="text-black text-[12px]">Company</span>
            <Link href="#" className="hover:text-black transition-colors">
              Pricing
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Story
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-black text-[12px]">Resources</span>
            <Link href="#" className="hover:text-black transition-colors">
              Developers
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Documentation
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Releases
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-black text-[12px]">Legal</span>
            <Link href="#" className="hover:text-black transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Status
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex justify-between items-center text-[10px] text-[#b2b2b2] font-bold uppercase border-t border-slate-100 pt-12">
        <span>© 2026 Spendwise Inc. 🌐 EN</span>
        <div className="flex gap-6">
          <GitBranch className="w-4 h-4 hover:text-black transition-colors cursor-pointer" />
          <Mail className="w-4 h-4 hover:text-black transition-colors cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
