import { motion } from "framer-motion";

/**
 * Numbered act header used across every conceptual stage so the journey reads
 * as one system: big number, English kicker, Hebrew title, and a bridge
 * sentence that explains why this stage exists and how it connects.
 */
export default function ActHeader({ num, kicker, title, bridge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start justify-between mb-14 md:mb-20 flex-wrap gap-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-frank text-base font-bold text-accent tabular-nums leading-none">{num}</span>
          <div className="w-6 h-px bg-accent" />
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground font-heebo uppercase">{kicker}</span>
        </div>
        <h2 className="font-frank text-4xl md:text-6xl font-bold text-foreground leading-[1.05]">{title}</h2>
      </div>
      {bridge && (
        <p className="font-heebo text-sm text-muted-foreground max-w-xs leading-[1.9] font-light self-end border-r-2 border-accent/40 pr-4">
          {bridge}
        </p>
      )}
    </motion.div>
  );
}
