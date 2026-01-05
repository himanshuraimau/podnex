"use client"

import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-border" />
          
          <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-6 block">
            Ready to Begin?
          </span>
          
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] mb-8">
            The future of
            <br />
            <span className="italic text-slate-light">audio is here.</span>
          </h2>
          
          <p className="text-xl font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
            Join the creators, networks, and enterprises who are already 
            building the next generation of audio content with PodNex.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" className="group">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl">
              Talk to Sales
            </Button>
          </div>

          <p className="mt-8 text-sm font-light text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

