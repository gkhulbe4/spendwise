"use client";

import { CreditCard, Moon, Users, CheckCircle2, Zap } from "lucide-react";

export function BentoGrid() {
  return (
    <section className="py-24 max-w-full bg-white relative overflow-hidden px-6">
      {/* Background Dots */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="max-w-6xl mx-auto font-sans relative z-10">
        <div>
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
              Integrated toolkit
              <br />
              <span className="text-[#b2b2b2]">for modern finance teams</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#b2b2b2] max-w-3xl font-medium leading-relaxed">
              The all-in-one suite to manage your company's finances. It's built
              so{" "}
              <span className="text-black font-bold">
                you own your data, not rent your access.
              </span>{" "}
              Experience speed and reliability designed for power-users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Large Feature: Live Dashboard */}
            <div className="md:col-span-8 md:row-span-2 bg-slate-50 border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group flex flex-col h-[480px]">
              <div className="p-8 pb-4">
                <h4 className="font-bold text-xl text-black mb-1">
                  Live Dashboard
                </h4>
                <p className="text-xs text-[#b2b2b2] font-semibold uppercase tracking-widest leading-none">
                  TRANSACTIONS SYNCED LIVE
                </p>
              </div>
              <div className="flex-1 px-8 relative overflow-hidden flex items-end">
                <img
                  src="/assets/dashboard.png"
                  alt="Spendwise Dashboard"
                  className="w-[120%] max-w-none -ml-4 rounded-2xl border-x-2 border-t-2 border-black/10 group-hover:-translate-y-4 transition-transform duration-500 shadow-2xl"
                />
              </div>
            </div>

            {/* Small Feature: Insights */}
            <div className="md:col-span-4 bg-emerald-50 border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group h-[232px] flex flex-col">
              <div className="p-6">
                <h4 className="font-bold text-sm text-black mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Insights
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Auto-categorise with AI clusters.
                </p>
              </div>
              <div className="flex-1 relative overflow-hidden px-4 mb-4">
                <img
                  src="/assets/insights.png"
                  alt="Analytics"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Small Feature: Keyboard Shortcuts */}
            <div className="md:col-span-4 bg-white border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group h-[232px] flex flex-col">
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h4 className="font-bold text-sm text-black mb-1">
                  Deep Integration
                </h4>
                <p className="text-[10px] text-[#878787] font-semibold uppercase tracking-widest">
                  / TO SEARCH
                </p>
              </div>
              <div className="h-24 bg-slate-100 flex items-center justify-center p-2">
                <img
                  src="/assets/kbd.png"
                  alt="Keyboard"
                  className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 mix-blend-multiply opacity-70"
                />
              </div>
            </div>

            {/* Medium Feature: Members */}
            <div className="md:col-span-4 bg-blue-50 border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group flex flex-col h-[300px]">
              <div className="p-6">
                <h4 className="font-bold text-sm text-black mb-1">
                  Collaboration
                </h4>
                <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">
                  MULTI-ORG TEAMS
                </p>
              </div>
              <div className="flex-1 relative bg-white m-4 mt-0 rounded-2xl border border-black/5 overflow-hidden">
                <img
                  src="/assets/members.png"
                  alt="Members"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Small Feature: Theme */}
            <div className="md:col-span-4 bg-black border-2 border-black rounded-[20px] p-8 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group text-white h-[300px] flex flex-col justify-between">
              <Moon className="w-10 h-10 text-white/50 group-hover:rotate-12 transition-transform" />
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest text-white/90">
                  THEME SYNC
                </h4>
                <p className="text-[10px] text-white/50 font-medium leading-relaxed">
                  Spendwise adapts to your environment automatically.
                </p>
              </div>
            </div>

            {/* Small Feature: AI Categorisation */}
            <div className="md:col-span-4 bg-yellow-400 border-2 border-black rounded-[20px] p-8 shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all group flex flex-col items-center justify-center text-center h-[300px]">
              <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[4px_4px_0_0_#000]">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-black text-lg uppercase tracking-tight">
                AI Categorisation
              </h4>
              <p className="text-[11px] text-black/60 font-semibold uppercase tracking-wider mt-2">
                SMART CLUSTERING ENGINE
              </p>
              <div className="flex items-center gap-2 mt-4 text-[10px] font-bold uppercase text-black/40">
                <span>SECURE SYNC</span>{" "}
                <div className="w-1 h-1 bg-black/20 rounded-full" />{" "}
                <span>256-BIT SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
