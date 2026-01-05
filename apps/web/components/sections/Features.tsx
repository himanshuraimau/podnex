"use client"

import { motion } from "framer-motion";
import { Mic, Users, Wand2, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Cloning",
    description: "Create authentic voice profiles from just 30 seconds of audio. Preserve nuance, tone, and personality.",
  },
  {
    icon: Users,
    title: "Multi-Speaker Synthesis",
    description: "Generate natural conversations between multiple AI voices with dynamic turn-taking and emotional range.",
  },
  {
    icon: Wand2,
    title: "Instant Mastering",
    description: "Studio-quality audio processing. Noise reduction, EQ optimization, and broadcast-ready output.",
  },
  {
    icon: Zap,
    title: "Real-time Generation",
    description: "Generate hours of content in minutes. Stream audio directly to your production pipeline.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant infrastructure. Your voice data is encrypted and never used for training.",
  },
  {
    icon: Globe,
    title: "40+ Languages",
    description: "Native-quality synthesis across languages. Perfect for global podcast distribution.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20"
        >
          <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
            The Suite
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
            Broadcasting thought.
            <br />
            <span className="italic text-slate-light">Engineered.</span>
          </h2>
          <p className="text-lg font-light text-muted-foreground leading-relaxed">
            Every tool designed for creators who demand precision. 
            From voice synthesis to final master, each feature serves the singular 
            purpose of elevating your audio.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-background p-10 hover:bg-surface/50 transition-colors duration-500"
            >
              <div className="mb-6">
                <feature.icon 
                  className="w-8 h-8 text-slate-light group-hover:text-foreground transition-colors duration-300" 
                  strokeWidth={1}
                />
              </div>
              <h3 className="font-serif text-xl font-medium mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

