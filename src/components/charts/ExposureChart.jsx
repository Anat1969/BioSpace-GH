import { motion, useReducedMotion } from "framer-motion";

/**
 * Two-series exposure line chart (hand-built SVG).
 * biophilic rises, windowless declines. The active series is drawn bold with a
 * soft area fill and animates its path; the other stays as a faint reference.
 * A marker tracks the current index.
 */
const W = 320, H = 130, PAD_X = 14, PAD_Y = 16;

export default function ExposureChart({ biophilic, windowless, activeType, activeIndex }) {
  const reduce = useReducedMotion();
  const n = biophilic.length;
  const xFor = (i) => PAD_X + (i * (W - 2 * PAD_X)) / (n - 1);
  const yFor = (v) => H - PAD_Y - (v / 100) * (H - 2 * PAD_Y);

  const toLine = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`).join(" ");
  const toArea = (arr) => `${toLine(arr)} L ${xFor(n - 1)} ${H - PAD_Y} L ${xFor(0)} ${H - PAD_Y} Z`;

  const active = activeType === "biophilic" ? biophilic : windowless;
  const other = activeType === "biophilic" ? windowless : biophilic;
  const tone = activeType === "biophilic" ? "bio" : "stress";
  const color = `hsl(var(--${tone}))`;
  const mx = xFor(activeIndex);
  const my = yFor(active[activeIndex]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="גרף חשיפה לאורך זמן">
      {/* baseline + top guides */}
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={PAD_X} x2={W - PAD_X}
          y1={PAD_Y + g * (H - 2 * PAD_Y)} y2={PAD_Y + g * (H - 2 * PAD_Y)}
          stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      ))}

      {/* inactive reference series */}
      <path d={toLine(other)} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1"
        strokeDasharray="3 4" opacity="0.4" />

      {/* active area + line */}
      <motion.path key={`area-${activeType}`} d={toArea(active)} fill={color}
        initial={{ opacity: 0 }} animate={{ opacity: 0.10 }} transition={{ duration: reduce ? 0 : 0.6 }} />
      <motion.path key={`line-${activeType}`} d={toLine(active)} fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }} />

      {/* moving marker */}
      <motion.circle r="4.5" fill={color} stroke="hsl(var(--background))" strokeWidth="2"
        initial={false} animate={{ cx: mx, cy: my }}
        transition={{ type: reduce ? false : "spring", stiffness: 300, damping: 26 }} />
    </svg>
  );
}
