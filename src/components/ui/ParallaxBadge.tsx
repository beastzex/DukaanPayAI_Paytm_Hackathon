'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBadgeProps {
  children: React.ReactNode;
  speed?: number; // e.g. -20 to 20
  className?: string;
}

export const ParallaxBadge: React.FC<ParallaxBadgeProps> = ({
  children,
  speed = 15,
  className = '',
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, speed * 2]);

  return (
    <motion.div
      style={{ y }}
      className={`absolute z-30 pointer-events-none rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-slate-800 ${className}`}
    >
      {children}
    </motion.div>
  );
};
