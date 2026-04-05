"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    handle: "@sarah_c",
    content:
      "Spendwise changed how we manage our multi-org expenses. Switching between entities in one click is a lifesaver.",
    company: "GrowthCo",
  },
  {
    name: "Rajiv Malhotra",
    handle: "@rajiv_m",
    content:
      "The AI-driven categorization on Spendwise is actually accurate. Our budget alerts are finally useful.",
    company: "Bharat Solutions",
  },
  {
    name: "Leo Dupont",
    handle: "@leod",
    content:
      "Finally a finance tool that doesn't feel like it's from 2005. The sleek UI and fast shortcuts make it fun.",
    company: "CreativeAgency",
  },
  {
    name: "Elena Rossi",
    handle: "@erossi",
    content:
      "Managing three different businesses used to be a nightmare. Spendwise makes it feel like one unified dashboard.",
    company: "Rossi & Co",
  },
  {
    name: "Aarav Gupta",
    handle: "@aarivg",
    content:
      "Indian tax compliance and multi-tenant support. Exactly what we needed for our expanding logistics firm.",
    company: "Gupta Logistics",
  },
  {
    name: "Jessica Wong",
    handle: "@jessw",
    content:
      "The transaction feed feels like magic. Instant sync across all our business accounts, no more manual uploads.",
    company: "Wong Tech",
  },
  {
    name: "Marcus Thorne",
    handle: "@thorny",
    content:
      "Simple, powerful, and modular. Spendwise just works. Our accounting team is finally happy.",
    company: "BluePeak Solutions",
  },
  {
    name: "Sofia Meyer",
    handle: "@smeyer",
    content:
      "Integrations are seamless. Tally and Razorpay sync perfectly. A true finance OS for scaling firms.",
    company: "Meyer Retail",
  },
  {
    name: "Kevin Park",
    handle: "@kpark",
    content:
      "The shortcuts are addictive. Recording an expense takes 2 seconds. No more lost receipts.",
    company: "Park Design",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative px-6">
      <div className="max-w-6xl mx-auto mb-20 text-left">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
            Loved by teams
            <br />
            <span className="text-[#b2b2b2]">saving time & money</span>
          </h2>
          <p className="text-xl md:text-2xl text-[#b2b2b2] max-w-3xl font-medium leading-relaxed">
            Join thousands of professionals who have upgraded their workflow.
            Spendwise ensures{" "}
            <span className="text-black font-bold">
              you get the freedom and cost savings
            </span>{" "}
            of a true finance OS.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto h-[600px] relative overflow-hidden flex gap-6"
      >
        <div className="flex-1">
          <MarqueeColumn items={testimonials.slice(0, 3)} speed="30s" />
        </div>
        <div className="flex-1 hidden md:block">
          <MarqueeColumn items={testimonials.slice(3, 6)} speed="45s" reverse />
        </div>
        <div className="flex-1 hidden lg:block">
          <MarqueeColumn items={testimonials.slice(6, 9)} speed="35s" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
      </motion.div>

      <style jsx global>{`
        @keyframes vertical-marquee {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-vertical-marquee {
          animation: vertical-marquee linear infinite;
        }
        .animate-vertical-marquee-reverse {
          animation: vertical-marquee linear infinite reverse;
        }
      `}</style>
    </section>
  );
}

function MarqueeColumn({
  items,
  speed,
  reverse,
}: {
  items: typeof testimonials;
  speed: string;
  reverse?: boolean;
}) {
  const doubledItems = [...items, ...items];

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        reverse
          ? "animate-vertical-marquee-reverse"
          : "animate-vertical-marquee",
      )}
      style={{ animationDuration: speed }}
    >
      {doubledItems.map((testimonial, idx) => (
        <TestimonialCard key={idx} {...testimonial} />
      ))}
    </div>
  );
}

function TestimonialCard({
  name,
  handle,
  content,
  company,
}: {
  name: string;
  handle: string;
  content: string;
  company: string;
}) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] text-left w-full shrink-0 group transition-all duration-300 hover:border-black hover:shadow-[4px_4px_0_0_#000]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 shrink-0 flex items-center justify-center font-bold text-blue-600 transition-transform group-hover:scale-105">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold text-sm text-black uppercase tracking-tight">
            {name}
          </div>
          <div className="text-[10px] font-semibold text-[#b2b2b2] uppercase tracking-widest">
            {handle} • {company}
          </div>
        </div>
      </div>
      <p className="text-[13px] text-slate-700 font-medium leading-relaxed italic">
        "{content}"
      </p>
    </div>
  );
}
