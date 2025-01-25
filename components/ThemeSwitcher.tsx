"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 15,
        duration: 0.2,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 45 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.2,
          }}
          className="relative z-10"
        >
          {theme === "dark" ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 rounded-full z-0"
        initial={false}
        animate={{
          backgroundColor:
            theme === "dark" ? "hsl(var(--primary))" : "hsl(var(--primary))",
          rotate: theme === "dark" ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.2,
        }}
      />
    </motion.button>
  );
}
