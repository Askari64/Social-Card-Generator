"use client";
// Small animation primitives (react-bits style): just enough motion to make
// the studio feel alive without touching the exportable card itself.
// Every animation honors prefers-reduced-motion by rendering the end state.
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Letters rise in one after another - used for the header wordmark.
export function SplitText({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={reduce ? false : { y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.03 * i, type: "spring", stiffness: 320, damping: 26 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// Generic rise-in wrapper for panels.
export function Rise({ children, className }: { children: ReactNode; delay?: number; className?: string }) {
  // Deliberately static: content must render fully even before hydration
  // (print, PNG export, and low-JS environments all depend on it).
  return <div className={className}>{children}</div>;
}
