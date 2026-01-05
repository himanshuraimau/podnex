"use client"

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

const codeSnippet = `import { PodNex } from '@podnex/sdk';

const client = new PodNex({ apiKey: process.env.PODNEX_API_KEY });

// Generate a podcast episode
const episode = await client.episodes.create({
  title: "The Future of AI",
  voices: ["alex_calm", "sarah_conversational"],
  script: [
    { speaker: "alex", text: "Welcome to the show..." },
    { speaker: "sarah", text: "Thanks for having me..." }
  ],
  mastering: {
    loudness: -16,
    format: "mp3",
    quality: "broadcast"
  }
});

console.log(episode.audioUrl);`;

const APISection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="py-32 relative bg-surface/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-light tracking-wider text-muted-foreground uppercase mb-4 block">
              Developer API
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-6">
              Audio Architecture
              <br />
              <span className="italic text-slate-light">for builders.</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground leading-relaxed mb-8">
              A single, elegant API that handles the complexity of podcast production. 
              Voice synthesis, conversation generation, and broadcast-ready mastering—all 
              in a few lines of code.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-px h-full bg-border" />
                <div>
                  <h4 className="font-serif text-lg mb-1 text-foreground">RESTful & SDK</h4>
                  <p className="text-sm font-light text-muted-foreground">
                    TypeScript, Python, and Go SDKs with full type safety.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-px h-full bg-border" />
                <div>
                  <h4 className="font-serif text-lg mb-1 text-foreground">Webhooks</h4>
                  <p className="text-sm font-light text-muted-foreground">
                    Real-time notifications for async generation workflows.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-px h-full bg-border" />
                <div>
                  <h4 className="font-serif text-lg mb-1 text-foreground">99.9% Uptime SLA</h4>
                  <p className="text-sm font-light text-muted-foreground">
                    Enterprise-grade reliability for production workloads.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="lg">
              Read Documentation
            </Button>
          </motion.div>

          {/* Right Column - Code Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-lg border border-border/50 bg-background overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                <span className="text-xs font-light text-muted-foreground">
                  generate-episode.ts
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-surface transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-slate-light" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              
              {/* Code */}
              <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed">
                <code className="text-slate-light">
                  {codeSnippet.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-right text-muted-foreground/50 mr-6 select-none">
                        {i + 1}
                      </span>
                      <span className="flex-1">
                        {line.includes('import') && (
                          <span>
                            <span className="text-slate">import</span>
                            {line.replace('import', '')}
                          </span>
                        )}
                        {line.includes('const') && (
                          <span>
                            <span className="text-slate">const</span>
                            {line.replace('const', '')}
                          </span>
                        )}
                        {line.includes('await') && (
                          <span>
                            <span className="text-slate">await</span>
                            {line.replace('await', '').replace('const', '').includes('const') ? (
                              <>
                                <span className="text-slate">const</span>
                                {line.replace(/await|const/g, '')}
                              </>
                            ) : line.replace('await', '')}
                          </span>
                        )}
                        {line.includes('console') && (
                          <span>
                            <span className="text-slate">console</span>
                            {line.replace('console', '')}
                          </span>
                        )}
                        {!line.includes('import') && !line.includes('const') && !line.includes('await') && !line.includes('console') && line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-muted/20 to-transparent rounded-2xl blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default APISection;
