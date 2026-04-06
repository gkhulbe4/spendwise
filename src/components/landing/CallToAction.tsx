"use client";

import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, Zap } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-24 bg-white relative overflow-hidden px-4 sm:px-6">
      {/* Background Dotted Pattern - Subtle */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="bg-white border-2 border-black rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center shadow-[6px_6px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] relative overflow-hidden">
          {/* Top Connectors */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
            </div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-200" />
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">SP</span>
            </div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-200" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
            Ready to master your <br />
            <span className="text-[#b2b2b2]">company's spending?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#898989] max-w-xl mx-auto mb-10 font-medium leading-relaxed">
            Join the forward-thinking teams using Spendwise to automate finance
            operations and save thousands.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="w-full sm:w-auto h-12 px-8 bg-black text-white text-sm font-extrabold rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]"
            >
              Get Started For Free <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="mailto:sales@spendwise.in"
              className="w-full sm:w-auto h-12 px-8 bg-white text-black border-2 border-slate-200 text-sm font-extrabold rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Contact Sales <Mail className="ml-2 w-4 h-4 opacity-70" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
