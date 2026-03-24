"use client";

import { motion, type Transition, useReducedMotion } from "motion/react";

const WORDMARK_TRANSITION: Transition = {
  duration: 1,
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
      <span className="font-pretendard-block">Sha</span>
      <motion.span
        className="inline-block overflow-hidden will-change-[width,opacity] font-pretendard-block"
        initial={{ opacity: 1, width: "2ch" }}
        animate={{ opacity: 0, width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        re
      </motion.span>
      <motion.span
        className="inline-block overflow-hidden font-pretendard-block"
        initial={{ width: "0.35ch" }}
        animate={{ width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        {" "}
      </motion.span>
      <span className="font-pretendard-block">thing</span>
      <motion.span
        className="inline-block overflow-hidden will-change-[width,opacity] font-pretendard-block"
        initial={{ opacity: 1, width: "1ch" }}
        animate={{ opacity: 0, width: 0 }}
        transition={WORDMARK_TRANSITION}
        aria-hidden
      >
        s
      </motion.span>
    </span>
  );
}
