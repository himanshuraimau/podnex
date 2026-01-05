import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Metrics from "@/components/sections/Metrics";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import APISection from "@/components/sections/APISection";
import VoiceFoundry from "@/components/sections/VoiceFoundry";
import Integrations from "@/components/sections/Integrations";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Page() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Metrics />
        <Features />
        <HowItWorks />
        <APISection />
        <VoiceFoundry />
        <Integrations />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
