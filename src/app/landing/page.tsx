import { LandingNavbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";
import { LandingFooter } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white font-gabarito">
      <LandingNavbar />
      <Hero />
      <FeaturesGrid />
      <BentoGrid />
      <Testimonials />
      <CallToAction />
      <LandingFooter />
    </main>
  );
}
