"use client";

import { motion } from "framer-motion";
import { CreditCard, Lightbulb, PieChart } from "lucide-react";

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-6 font-sans text-center md:text-left">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
        >
          <div className="mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6 leading-[1.1]">
              Master your spending
              <br />
              <span className="text-[#b2b2b2]">with actionable insights</span>
            </h2>
            <p className="text-xl md:text-2xl text-[#b2b2b2] max-w-3xl font-medium leading-relaxed">
              Spendwise automates the heavy lifting of finance management. It
              means{" "}
              <span className="text-black font-bold">
                you control, not just track, your money.
              </span>{" "}
              You get the power of enterprise analytics with the simplicity of a
              consumer app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            <FeatureCard
              title="1. Connect"
              desc="Securely link your business cards and accounts in seconds."
              icon={<CreditCard className="w-16 h-16 text-black stroke-[1.5]" />}
              color="bg-[#d8f4e2]"
            />
            <FeatureCard
              title="2. Categorize"
              desc="AI automatically maps expenses to categories and projects."
              icon={<Lightbulb className="w-16 h-16 text-black stroke-[1.5]" />}
              color="bg-[#cce4ff]"
            />
            <FeatureCard
              title="3. Optimize"
              desc="Identify waste and re-allocate budget where it matters most."
              icon={<PieChart className="w-16 h-16 text-black stroke-[1.5]" />}
              color="bg-[#f0d8ff]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  color,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-4 group text-left">
      <div
        className={`w-40 h-40 ${color} border-2 border-black rounded-3xl flex items-center justify-center shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-black uppercase tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-[#b2b2b2] mt-1 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
