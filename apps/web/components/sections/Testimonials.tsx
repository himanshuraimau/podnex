"use client"

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "PodNex has fundamentally changed how we produce content. What used to take weeks now takes hours, with better quality than we ever achieved in-studio.",
    author: "Sarah Chen",
    role: "Head of Audio, The Atlantic",
    avatar: "SC",
  },
  {
    quote: "The API is a work of art. Clean, predictable, and incredibly powerful. We've built our entire podcast automation pipeline on PodNex.",
    author: "Marcus Williams",
    role: "CTO, Podium Media",
    avatar: "MW",
  },
  {
    quote: "Voice cloning that actually sounds human. We've tried every solution on the market—nothing comes close to this level of naturalness.",
    author: "Elena Rodriguez",
    role: "Executive Producer, NPR",
    avatar: "ER",
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mb-20"
        >
          <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
            Trusted by
            <br />
            <span className="italic text-slate-light">pioneers.</span>
          </h2>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 border border-border/30 rounded-lg bg-surface/20 hover:bg-surface/40 transition-colors duration-300"
            >
              {/* Quote */}
              <blockquote className="mb-8">
                <p className="text-lg font-light text-foreground/90 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface border border-border/50 flex items-center justify-center">
                  <span className="text-sm font-light text-muted-foreground">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-base text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm font-light text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

