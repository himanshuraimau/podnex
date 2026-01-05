"use client"

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";

const faqs = [
  {
    question: "How does voice cloning work?",
    answer: "Our neural network analyzes audio samples to capture the unique characteristics of a voice—pitch, timbre, cadence, and emotional patterns. With just 30 seconds of high-quality audio, we create a voice model that can synthesize new speech while preserving the original voice's natural qualities.",
  },
  {
    question: "Is my voice data secure?",
    answer: "Absolutely. We're SOC 2 Type II compliant and all voice data is encrypted at rest and in transit. Your voice models are never used to train our base models, and you retain full ownership of all cloned voices. Enterprise customers can opt for dedicated infrastructure.",
  },
  {
    question: "Can I use generated content commercially?",
    answer: "Yes. All audio generated through PodNex is fully licensed for commercial use. You own the rights to any content created with your voice clones, and our stock voices are cleared for broadcast, streaming, and distribution.",
  },
  {
    question: "What languages are supported?",
    answer: "We support over 40 languages with native-quality synthesis, including English, Spanish, Mandarin, Japanese, German, French, Portuguese, and more. Multi-language support within a single episode is also available.",
  },
  {
    question: "How do I integrate the API?",
    answer: "We offer SDKs for TypeScript, Python, and Go, along with a comprehensive REST API. Most developers are up and running within an hour. Our documentation includes quickstart guides, code samples, and a sandbox environment for testing.",
  },
  {
    question: "What's your uptime guarantee?",
    answer: "We maintain a 99.9% uptime SLA for all paid plans. Our infrastructure is distributed across multiple regions with automatic failover. Enterprise customers can access dedicated instances with custom SLA terms.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-32 relative bg-surface/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
              FAQ
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
              Questions,
              <br />
              <span className="italic text-slate-light">answered.</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground leading-relaxed">
              Everything you need to know about PodNex. 
              Can't find what you're looking for? Reach out to our team.
            </p>
          </motion.div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border/30 rounded-lg px-6 bg-background data-[state=open]:bg-surface/50 transition-colors"
                >
                  <AccordionTrigger className="font-serif text-lg font-medium text-foreground hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base font-light text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
