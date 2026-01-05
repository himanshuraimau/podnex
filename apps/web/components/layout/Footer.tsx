"use client"

import { motion } from "framer-motion";
import Link from "next/link";

const footerLinks = {
  Product: ["Features", "API", "Pricing", "Changelog", "Documentation"],
  Company: ["About", "Blog", "Careers", "Press", "Partners"],
  Resources: ["Help Center", "Status", "Security", "Privacy", "Terms"],
  Connect: ["Twitter", "LinkedIn", "GitHub", "Discord"],
};

const Footer = () => {
  return (
    <footer className="py-20 border-t border-border/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="col-span-2">
            <Link href="#" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                PodNex
              </span>
            </Link>
            <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-xs">
              The architecture of conversation. AI-driven podcast creation 
              for visionaries.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-serif text-sm font-medium text-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/30">
          <p className="text-xs font-light text-muted-foreground mb-4 md:mb-0">
            © 2024 PodNex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

