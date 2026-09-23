import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const FINDINGS = [
  {
    index: "01",
    category: "Environmental Health",
    prefix: "", num: 18, suffix: "%", decimals: 0,
    label: "הפחתה בימי מחלה",
    body: "סביבות עבודה עם חשיפה לאור יום טבעי מפחיתות את שיעורי ההיעדרות עקב מחלה באופן מובהק סטטיסטית.",
    source: "Heschong, R. et al. (2003). Daylight in Schools",
    bar: 72,
    tone: "bio",
  },
  {
    index: "02",
    category: "Neuroendocrinology",
    prefix: "↓", num: 34, suffix: "%", decimals: 0,
    label: "ירידת קורטיזול בסביבה ביופילית",
    body: "חשיפה לנוף טבעי, אפילו דרך חלון, מורידה ריכוזי קורטיזול ומדדי סטרס פיזיולוגיים תוך דקות.",
    source: "Ulrich, R.S. (1984). Science, 224(4647)",
    bar: 55,
    tone: "accent",
  },
  {
    index: "03",
    category: "Gender & Space",
    prefix: "×", num: 2.1, suffix: "", decimals: 1,
    label: "פגיעות מוגברת בנשים בסביבה נטולת טבע",
    body: "נשים בשכונות דלות בירוק מציגות רמות קורטיזול ורמות דיכאון גבוהות פי שניים מגברים באותן סביבות.",
    source: "Roe, J. et al. (2013). Edinburgh University",
    bar: 88,
    tone: "stress",
  },
];

// Count-up number that animates once when scrolled into view.
function CountUpStat({ prefix = "", num, suffix = "", decimals = 0, tone }) {
  const [n, setN] = useState(0);
  const raf = useRef();
  const reduce = useReducedMotion();

  const run = () => {
    if (reduce) { setN(num); return; }
    const t0 = performance.now();
    const dur = 1400;
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(parseFloat((num * eased).toFixed(decimals)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <motion.span
      onViewportEnter={run}
      viewport={{ once: true, margin: "-40px" }}
      className="font-frank text-5xl md:text-6xl font-bold tabular-nums leading-none"
      style={{ color: `hsl(var(--${tone}))` }}
    >
      {prefix}{n.toLocaleString("he-IL")}{suffix}
    </motion.span>
  );
}

export default function FindingsList() {
  return (
    <div className="space-y-0">
      {FINDINGS.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="group grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-12 py-12 border-t border-border hover:bg-secondary/30 transition-colors duration-300 px-4 -mx-4"
        >
          {/* Index */}
          <div className="flex flex-row md:flex-col items-center md:items-start gap-3">
            <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">{f.index}</span>
            <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase hidden md:block">{f.category}</span>
          </div>

          {/* Stat + bar */}
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <CountUpStat prefix={f.prefix} num={f.num} suffix={f.suffix} decimals={f.decimals} tone={f.tone} />
            </div>
            <p className="font-heebo text-sm text-foreground/70 mb-5">{f.label}</p>

            <div className="h-1.5 w-full bg-border/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${f.bar}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
                style={{ background: `hsl(var(--${f.tone}))` }}
              />
            </div>
          </div>

          {/* Body + source */}
          <div className="flex flex-col justify-between gap-5">
            <p className="font-heebo text-sm text-muted-foreground leading-[1.9] font-light">{f.body}</p>
            <p className="font-heebo text-[10px] text-muted-foreground/50 italic border-t border-border pt-4">{f.source}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
