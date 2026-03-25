import { motion } from "framer-motion";

const STATS = [
  { value: "18%", label: "פחות ימי מחלה" },
  { value: "↓34%", label: "קורטיזול בסביבה ביופילית" },
  { value: "4 דק׳", label: "עד שינוי פיזיולוגי מדיד" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" dir="rtl">

      {/* ── Base gradient ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,hsl(38,30%,12%),hsl(30,10%,5%))]" />

      {/* ── Diagonal light beams ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { right: "28%", width: "w-48", delay: "0s",  opacity: "opacity-[0.14]", rotate: "rotate-[22deg]" },
          { right: "55%", width: "w-28", delay: "4s",  opacity: "opacity-[0.07]", rotate: "rotate-[16deg]" },
          { right: "10%", width: "w-20", delay: "7s",  opacity: "opacity-[0.09]", rotate: "rotate-[30deg]" },
        ].map((b, i) => (
          <div
            key={i}
            style={{ right: b.right, animationDelay: b.delay }}
            className={`absolute top-0 ${b.width} h-[130%] bg-gradient-to-b from-primary via-primary/20 to-transparent ${b.rotate} ${b.opacity} origin-top animate-beam-drift blur-lg`}
          />
        ))}
      </div>

      {/* ── Grain texture ── */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full pt-24 pb-16">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-[1.5px] bg-primary/70" />
          <span className="text-[11px] tracking-[0.35em] text-primary/60 font-heebo uppercase">
            Architectural Endocrinology — BioSpace
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-frank leading-[1.0] text-foreground mb-6">
            <span className="block text-[clamp(3rem,8vw,7rem)] font-bold">הגוף קורא</span>
            <span className="block text-[clamp(3rem,8vw,7rem)] font-bold text-primary">את הקירות</span>
          </h1>
        </motion.div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-heebo text-lg md:text-xl text-foreground/55 leading-relaxed max-w-lg mb-12"
        >
          מתרגמים ביולוגיה לבינוי. גלה את הביופרופיל ההורמונלי של החלל שלך.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex flex-wrap items-center gap-4 mb-20"
        >
          <button className="bg-primary text-primary-foreground font-heebo font-semibold px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all duration-300 text-sm tracking-wide shadow-lg shadow-primary/20">
            סרוק את החלל שלך
          </button>
          <button className="text-foreground/50 font-heebo text-sm hover:text-foreground transition-colors flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-foreground/20 flex items-center justify-center text-xs">▶</span>
            למד עוד
          </button>
        </motion.div>

        {/* ── Stat strip ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-0 border-t border-border/30 pt-8"
        >
          {STATS.map((s, i) => (
            <div key={i} className={`flex items-center gap-4 ${i < STATS.length - 1 ? "sm:pl-10 sm:ml-10 sm:border-l sm:border-border/30" : ""}`}>
              <span className="font-frank text-2xl md:text-3xl font-bold text-primary/90 tabular-nums">{s.value}</span>
              <span className="text-xs text-muted-foreground font-heebo leading-tight max-w-[100px]">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom moss line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-l from-transparent via-accent/50 to-transparent" />

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="w-[1px] h-8 bg-gradient-to-b from-border/0 to-border/60 animate-pulse" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo">גלול</span>
      </motion.div>
    </section>
  );
}