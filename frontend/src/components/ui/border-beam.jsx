import { motion } from "motion/react";

import { cn } from "@/lib/utils"

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
      style={{
        padding: `${borderWidth}px`,
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        ...style,
      }}>
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={{
          width: size,
          background: `conic-gradient(from 0deg, transparent, ${colorFrom}, ${colorTo}, transparent, transparent)`,
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}
        animate={{
          rotate: reverse ? [0, -360] : [0, 360],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }} />
    </div>
  );
};
