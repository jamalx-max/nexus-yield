import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  variant?: 'fade' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScrollAnimation({ 
  children, 
  variant = 'slideUp', 
  className = '',
  delay = 0,
  duration = 0.5
}: ScrollAnimationProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }} // Repeats animation when scrolling in/out
      variants={variants[variant]}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
