import { motion } from "framer-motion";

const INSIGHTS = [
  {
    stat: "18%",
    category: "בריאות ארגונית",
    headline: "פחות ימי מחלה בסביבת עבודה עם אור יום תקין",
    body: "מחקרים עקביים מצביעים על כך שחשיפה לאור יום טבעי מפחיתה היעדרויות בשל מחלה.",
    source: null,
    accent: "text-primary",
    bar: "bg-primary/70",
    pct: 82,
  },
  {
    stat: null,
    category: "מגדר וסביבה",
    headline: "נשים בשכונות דלות בטבע — קורטיזול גבוה משמעותית",
    body: "סביבה נטולת טבע מעלה קורטיזול במיוחד אצל נשים ואוכלוסיות פגיעות. המרחב אינו ניטרלי.",
    source: "ד״ר ג׳ני רואי, University of Edinburgh",
    accent: "text-red-400",
    bar: "bg-red-500/60",
    pct: 68,
  },
];

export default function ScientificBanner() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden" dir="rtl">

      {/* Subtle mid-page gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="w-10 h-[1.5px] bg-accent/60" />
          <span className="text-[11px] tracking-[0.3em] text-muted-foreground font-heebo uppercase">
            תובנות מדעיות
          </span>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INSIGHTS.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-sm border border-border/50 bg-card p-8 md:p-10 flex flex-col gap-5 overflow-hidden"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] ${ins.bar}`} />

              {/* Category tag */}
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground/60 font-heebo uppercase">
                {ins.category}
              </span>

              {/* Stat or icon */}
              {ins.stat ? (
                <div className="flex items-end gap-3">
                  <span className={`font-frank text-6xl md:text-7xl font-bold leading-none ${ins.accent}`}>
                    {ins.stat}
                  </span>
                  <span className="font-heebo text-sm text-muted-foreground pb-2 leading-tight max-w-[120px]">
                    {ins.headline}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/70 mt-1 flex-shrink-0 animate-pulse" />
                  <p className="font-frank text-lg md:text-xl font-bold text-foreground leading-snug">
                    {ins.headline}
                  </p>
                </div>
              )}

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="h-[3px] w-full bg-border/40 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${ins.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${ins.bar}`}
                  />
                </div>
                <span className={`text-xs font-frank font-bold ${ins.accent}`}>{ins.pct}%</span>
              </div>

              {/* Body */}
              <p className="font-heebo text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                {ins.body}
              </p>

              {/* Source */}
              {ins.source && (
                <p className="text-[10px] text-muted-foreground/50 font-heebo mt-auto">
                  — {ins.source}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}