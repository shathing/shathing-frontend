"use client";

import { motion, type Transition, useReducedMotion } from "motion/react";

const WORDMARK_TRANSITION: Transition = {
  duration: 2,
  delay: 1,
  ease: [0.22, 1, 0.36, 1] as const,
  repeat: Infinity,
  repeatType: "mirror",
  repeatDelay: 5,
};

export default function ShareThingsWordmark() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span>Share things</span>;
  }

  return (
    <span className="inline-flex items-baseline whitespace-nowrap" aria-label="Share things">
      <span>Sha</span>
      <motion.span
        className="inline-block overflow-hidden will-change-[width,opacity,filter]"
        initial={{ opacity: 1, filter: "blur(0px)", width: "2ch" }}
        animate={{ opacity: 0, filter: "blur(8px)", width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        re
      </motion.span>
      <motion.span
        className="inline-block overflow-hidden"
        initial={{ width: "0.35ch" }}
        animate={{ width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        {" "}
      </motion.span>
      <span>thing</span>
      <motion.span
        className="inline-block overflow-hidden will-change-[width,opacity,filter]"
        initial={{ opacity: 1, filter: "blur(0px)", width: "1ch" }}
        animate={{ opacity: 0, filter: "blur(8px)", width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        s
      </motion.span>
    </span>
  );
}
