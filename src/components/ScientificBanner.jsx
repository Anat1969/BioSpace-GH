import { motion } from "framer-motion";

const INSIGHTS = [
  {
    stat: "18%",
    text: "פחות ימי מחלה בסביבה עם אור יום תקין"
  },
  {
    stat: null,
    text: "סביבה נטולת טבע מעלה משמעותית קורטיזול, במיוחד אצל נשים ואוכלוסיות פגיעות",
    source: "מחקרה של ד\"ר ג'ני רואי"
  }
];

export default function ScientificBanner() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden" dir="rtl">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/40 to-background" />
      
      {/* Horizontal architectural lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-14">
          <div className="w-8 h-[2px] bg-primary/50" />
          <span className="text-xs tracking-[0.3em] text-muted-foreground font-heebo">
            תובנות מדעיות
          </span>
        </div>

        <div className="space-y-16">
          {INSIGHTS.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.9, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col md:flex-row items-start gap-6 md:gap-10"
            >
              {/* Stat or marker */}
              <div className="flex-shrink-0">
                {insight.stat ? (
                  <span className="font-frank text-5xl md:text-6xl font-bold text-primary/80">
                    {insight.stat}
                  </span>
                ) : (
                  <div className="w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-accent/60 animate-moss-pulse" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="border-r-2 border-primary/15 pr-6">
                <p className="font-heebo text-lg md:text-xl text-foreground/85 leading-relaxed">
                  {insight.text}
                </p>
                {insight.source && (
                  <p className="mt-2 text-sm text-muted-foreground font-heebo">
                    — {insight.source}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}