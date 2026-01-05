"use client"

import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

const voices = [
  { name: "Alex", style: "Calm & Authoritative", accent: "American", duration: "0:12" },
  { name: "Sarah", style: "Warm & Conversational", accent: "British", duration: "0:15" },
  { name: "Marcus", style: "Dynamic & Energetic", accent: "Australian", duration: "0:10" },
  { name: "Elena", style: "Elegant & Professional", accent: "European", duration: "0:14" },
];

const VoiceFoundry = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Voice Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {voices.map((voice, index) => (
              <motion.div
                key={voice.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex items-center gap-6 p-6 rounded-lg border border-border/30 bg-surface/30 hover:bg-surface/60 hover:border-border/50 transition-all duration-300 cursor-pointer"
                onClick={() => setPlayingIndex(playingIndex === index ? null : index)}
              >
                {/* Play Button */}
                <div className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center group-hover:border-slate-light transition-colors">
                  {playingIndex === index ? (
                    <Pause className="w-4 h-4 text-slate-light" />
                  ) : (
                    <Play className="w-4 h-4 text-slate-light ml-0.5" />
                  )}
                </div>

                {/* Voice Info */}
                <div className="flex-1">
                  <h4 className="font-serif text-lg text-foreground mb-1">{voice.name}</h4>
                  <p className="text-sm font-light text-muted-foreground">
                    {voice.style} · {voice.accent}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-xs font-light text-muted-foreground">
                  {voice.duration}
                </span>

                {/* Waveform visualization */}
                <div className="flex items-center gap-0.5 h-8">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 bg-slate-light/30 rounded-full transition-all duration-300 ${
                        playingIndex === index ? "animate-pulse" : ""
                      }`}
                      style={{
                        height: `${8 + Math.random() * 20}px`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
              Voice Foundry
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
              Voices that
              <br />
              <span className="italic text-slate-light">resonate.</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground leading-relaxed mb-8">
              Our neural voice models capture the subtle nuances of human speech—breath, 
              cadence, emotional inflection. Each voice is trained on thousands of hours 
              of professional recordings.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="font-serif text-4xl text-foreground">100+</span>
                <p className="text-sm font-light text-muted-foreground mt-1">
                  Premium voice models
                </p>
              </div>
              <div>
                <span className="font-serif text-4xl text-foreground">40+</span>
                <p className="text-sm font-light text-muted-foreground mt-1">
                  Languages supported
                </p>
              </div>
              <div>
                <span className="font-serif text-4xl text-foreground">30s</span>
                <p className="text-sm font-light text-muted-foreground mt-1">
                  To clone any voice
                </p>
              </div>
              <div>
                <span className="font-serif text-4xl text-foreground">99%</span>
                <p className="text-sm font-light text-muted-foreground mt-1">
                  Natural speech rating
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VoiceFoundry;

