"use client";

import { animate, AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAppStore } from "@/lib/store";
// import animationData from "@/animations/donut-drift.lottie";

export default function Loading() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-slate-100 dark:bg-zinc-950 z-50"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-48 h-48 rounded-full p-4 "
        >
          {/* <DotLottieReact loop src="/animations/donut-drift.lottie" /> */}
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M10,50 A40,40 0 1,1 90,50 A40,40 0 1,1 10,50"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.path
              d="M30,50 L70,50 L65,40 L35,40 Z M25,60 L35,60 L35,65 L25,65 Z M65,60 L75,60 L75,65 L65,65 Z"
              fill="#ffffff"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
