"use client"

import { motion } from "framer-motion";
import { Button } from "@workspace/ui/components/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Creator",
    price: "49",
    description: "For independent podcasters and content creators.",
    features: [
      "10 hours of generation / month",
      "5 voice clones",
      "Standard mastering",
      "MP3 & WAV export",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Studio",
    price: "199",
    description: "For production teams and growing networks.",
    features: [
      "50 hours of generation / month",
      "25 voice clones",
      "Advanced mastering suite",
      "All export formats",
      "API access",
      "Priority support",
      "Custom voice training",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale production and distribution.",
    features: [
      "Unlimited generation",
      "Unlimited voice clones",
      "White-label solution",
      "Dedicated infrastructure",
      "Custom integrations",
      "24/7 support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 relative bg-surface/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
            Investment in
            <br />
            <span className="italic text-slate-light">excellence.</span>
          </h2>
          <p className="text-lg font-light text-muted-foreground leading-relaxed">
            Transparent pricing for every stage of growth. Start free, scale without limits.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 lg:p-10 rounded-lg ${
                plan.popular 
                  ? "border-2 border-slate-light/30 bg-surface" 
                  : "border border-border/30 bg-background"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-light tracking-wider uppercase bg-background border border-slate-light/30 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-8">
                <h3 className="font-serif text-2xl font-medium mb-2 text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm font-light text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && (
                    <span className="text-sm font-light text-muted-foreground">$</span>
                  )}
                  <span className="font-serif text-5xl text-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm font-light text-muted-foreground">/month</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-slate-light mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-light text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? "primary" : "outline"} 
                className="w-full"
                size="lg"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
