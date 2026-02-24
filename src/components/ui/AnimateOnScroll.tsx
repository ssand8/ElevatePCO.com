"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

const directionOffsets = {
  up: { y: 30, x: 0 },
  left: { y: 0, x: -30 },
  right: { y: 0, x: 30 },
};

export function AnimateOnScroll({
  children,
  className,
  direction = "up",
  delay = 0,
}: AnimateOnScrollProps) {
  const offset = directionOffsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
