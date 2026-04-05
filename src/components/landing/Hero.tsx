"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative py-12 overflow-hidden bg-white">
      {/* Background Dots - High Density Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e2e8f0 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Central Spotlight Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[#898989] text-xs font-semibold mb-10 hover:border-slate-200 transition-colors pointer-events-auto cursor-pointer group">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Spendwise v0.1: Multi-tenant finance reporting
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tight text-black mb-6 leading-[0.9]">
            Modern finance
            <br />
            <span className="text-[#b2b2b2]">workspace</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-[#898989] max-w-2xl mx-auto mb-12 font-normal leading-relaxed">
            The integrated suite to manage, track, and optimize your company's
            spending.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/auth"
              className="h-14 px-10 bg-black text-white text-base font-bold rounded-xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="h-14 px-10 bg-white text-black text-base font-bold rounded-xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]">
              Talk to us <MessageCircle className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Hero Illustration */}
          <div className="relative max-w-5xl mx-auto group">
            <div className="relative rounded-2xl transition-all">
              <img
                src="/assets/hero-img.png"
                alt="Spendwise Finance Dashboard Dashboard"
                className="w-full h-auto rounded-2xl "
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
