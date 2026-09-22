import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Full-bleed image band with a forest-green tint overlay and an optional
 * editorial caption. Subtle parallax on the image, disabled when the user
 * prefers reduced motion.
 */
export default function ImageBand({ image, alt = "", eyebrow, caption, height = "58vh" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Image drifts a touch slower than the scroll for depth.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      dir="rtl"
      className="relative w-full overflow-hidden"
      style={{ height, minHeight: 340 }}
    >
      <motion.img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover"
      />

      {/* Forest tint — keeps text legible and unifies with the palette */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/25 to-primary/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_120%,hsl(var(--primary)/0.45),transparent_70%)] pointer-events-none" />

      {(eyebrow || caption) && (
        <div className="absolute bottom-0 right-0 left-0 p-8 md:p-16">
          <div className="max-w-6xl mx-auto">
            {eyebrow && (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px bg-primary-foreground/70" />
                <span className="text-[10px] tracking-[0.35em] text-primary-foreground/90 font-heebo uppercase font-medium">
                  {eyebrow}
                </span>
              </div>
            )}
            {caption && (
              <p className="font-frank text-2xl md:text-4xl font-light text-primary-foreground max-w-2xl leading-tight drop-shadow-sm">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
