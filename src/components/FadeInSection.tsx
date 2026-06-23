import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Margin for useInView. Default "-80px" */
  margin?: UseInViewOptions["margin"];
  /** Distance to animate. Default 30 */
  distance?: number;
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  margin = "-80px",
  distance = 30,
}: FadeInSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
