import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated 270° arc gauge (hand-built SVG, hairline aesthetic).
 * `tone` is a semantic color token name: "bio" | "stress" | "accent" | "primary".
 * The numeric readout is passed as children (e.g. an AnimatedNumber).
 */
export default function RadialGauge({
  value,
  min = 0,
  max = 100,
  tone = "bio",
  unit,
  size = 132,
  children,
}) {
  const reduce = useReducedMotion();
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arc = 0.75 * c; // visible 270° track
  const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const color = `hsl(var(--${tone}))`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="hsl(var(--border))" strokeWidth={stroke}
          strokeDasharray={`${arc} ${c}`} strokeLinecap="round"
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${arc} ${c}`} strokeLinecap="round"
          initial={false}
          animate={{ strokeDashoffset: arc * (1 - fraction) }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-frank text-3xl font-bold tabular-nums leading-none" style={{ color }}>
          {children}
        </span>
        {unit && <span className="text-[10px] text-muted-foreground font-heebo mt-1">{unit}</span>}
      </div>
    </div>
  );
}
