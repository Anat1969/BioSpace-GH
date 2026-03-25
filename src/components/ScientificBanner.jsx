import { motion } from "framer-motion";

const FINDINGS = [
  {
    index: "01",
    category: "Environmental Health",
    stat: "18%",
    label: "הפחתה בימי מחלה",
    body: "סביבות עבודה עם חשיפה לאור יום טבעי מפחיתות את שיעורי ההיעדרות עקב מחלה באופן מובהק סטטיסטית.",
    source: "Heschong, R. et al. (2003). Daylight in Schools",
    bar: 72,
    color: "bg-primary/70",
  },
  {
    index: "02",
    category: "Neuroendocrinology",
    stat: "↓34%",
    label: "ירידת קורטיזול בסביבה ביופילית",
    body: "חשיפה לנוף טבעי, אפילו דרך חלון, מורידה ריכוזי קורטיזול ומדדי סטרס פיזיולוגיים תוך דקות.",
    source: "Ulrich, R.S. (1984). Science, 224(4647)",
    bar: 55,
    color: "bg-accent/70",
  },
  {
    index: "03",
    category: "Gender & Space",
    stat: "×2.1",
    label: "פגיעות מוגברת בנשים בסביבה נטולת טבע",
    body: "נשים בשכונות דלות בירוק מציגות רמות קורטיזול ורמות דיכאון גבוהות פי שניים מגברים באותן סביבות.",
    source: "Roe, J. et al. (2013). Edinburgh University",
    bar: 88,
    color: "bg-foreground/40",
  },
];

export default function ScientificBanner() {
  return (
    <section className="relative py-28 md:py-40 overflow-hidden border-t border-border" dir="rtl">

      <div className="max-w-6xl mx-auto px-8 md:px-20">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="flex items-start justify-between mb-20 flex-wrap gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-accent" />
              <span className="text-[10px] tracking-[0.35em] text-muted-foreground font-heebo uppercase">Evidence Base</span>
            </div>
            <h2 className="font-frank text-3xl md:text-4xl font-bold text-foreground leading-tight">
              ממצאי מחקר<br />
              <span className="font-light">מרכזיים</span>
            </h2>
          </div>
          <p className="font-heebo text-sm text-muted-foreground max-w-xs leading-[1.8] font-light self-end">
            ממצאים עקביים ממחקרים peer-reviewed על הקשר בין סביבה בנויה לבריאות פיזיולוגית.
          </p>
        </motion.div>

        {/* Findings list */}
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
                  <span className="font-frank text-5xl md:text-6xl font-bold text-foreground tabular-nums leading-none">{f.stat}</span>
                </div>
                <p className="font-heebo text-sm text-foreground/70 mb-5">{f.label}</p>

                {/* Progress bar */}
                <div className="h-[2px] w-full bg-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.bar}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full ${f.color}`}
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
      </div>
    </section>
  );
}