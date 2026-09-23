import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Animated horizontal comparison bars (hand-built).
 * items: [{ label, value, tone, active }] — `tone` is a semantic token name.
 * The active row is emphasised; an ArrowUp marks the highest value.
 */
export default function ComparisonBars({ items, max, unit = "" }) {
  const reduce = useReducedMotion();
  const peak = Math.max(...items.map((i) => i.value));

  return (
    <div className="space-y-4">
      {items.map((it) => {
        const pct = Math.max(0, Math.min(100, (it.value / max) * 100));
        const color = `hsl(var(--${it.tone}))`;
        const isPeak = it.value === peak;
        return (
          <div key={it.label} className={it.active ? "opacity-100" : "opacity-55"}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-heebo text-muted-foreground">{it.label}</span>
              <span
                className="font-frank text-lg font-bold tabular-nums flex items-center gap-1"
                style={{ color }}
              >
                {isPeak && <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />}
                {it.value}{unit}
              </span>
            </div>
            <div className="h-2 w-full bg-border/60 overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: color }}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
