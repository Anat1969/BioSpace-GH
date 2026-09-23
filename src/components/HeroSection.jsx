import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import heroImg from "@/assets/hero-green-terraces.jpg";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

const STATS = [
  { value: "18%", label: "הפחתה בימי מחלה", note: "Ulrich, 1984" },
  { value: "34%", label: "ירידת קורטיזול", note: "J. Roe et al." },
  { value: "4 min", label: "לשינוי פיזיולוגי", note: "Kaplan, 1989" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function HeroSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);

  // Parallax: image drifts slightly slower than scroll.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);

  // Mount the three.js layer only after first paint, and never under reduced motion.
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setShowCanvas(true), 600);
    return () => clearTimeout(id);
  }, [reduce]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden" dir="rtl">

      {/* ── Warm paper background ── */}
      <div className="absolute inset-0 bg-background" />

      {/* ── Biophilic photograph (parallax) ── */}
      <motion.img
        src={heroImg}
        alt="אדריכלות ביופילית — מרפסות מדורגות עם צמחייה"
        decoding="async"
        style={{ y: imgY }}
        className="absolute inset-0 w-full h-[118%] -top-[4%] object-cover"
      />

      {/* ── Living gradient mesh ── */}
      <div className="absolute inset-0 pointer-events-none opacity-60 animate-mesh-drift bg-[radial-gradient(40%_50%_at_18%_30%,hsl(var(--bio)/0.20),transparent_70%),radial-gradient(45%_55%_at_80%_75%,hsl(var(--primary)/0.18),transparent_70%)]" />

      {/* ── Readability veil (opaque on the text side, RTL) ── */}
      <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/20 pointer-events-none" />

      {/* ── Forest tint ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_20%_100%,hsl(var(--primary)/0.28),transparent_65%)] pointer-events-none" />

      {/* ── 3D wireframe structure (lazy, gated) ── */}
      {showCanvas && (
        <div className="absolute inset-0 z-[6] opacity-45 mix-blend-multiply pointer-events-none">
          <Suspense fallback={null}>
            <HeroCanvas />
          </Suspense>
        </div>
      )}

      {/* ── Very subtle warm vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_-20%,hsl(36,30%,93%,0.5),transparent_70%)] pointer-events-none" />

      {/* ── Moving light beam (uses the beam-drift keyframe) ── */}
      <div className="absolute top-0 right-[28%] h-full w-32 md:w-44 blur-2xl animate-beam-drift bg-gradient-to-b from-primary/15 via-accent/8 to-transparent pointer-events-none" />

      {/* ── Single soft light column ── */}
      <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />

      {/* ── Content container ── */}
      <div className="relative z-10 px-8 md:px-20 lg:px-32 max-w-7xl mx-auto w-full pt-28 pb-20">

        {/* Eyebrow */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-14">
          <div className="w-8 h-px bg-primary/40" />
          <span className="text-[10px] tracking-[0.4em] text-muted-foreground font-heebo uppercase font-medium">
            Biophilic Architecture Research
          </span>
        </motion.div>

        {/* Headline — large editorial */}
        <motion.div {...fadeUp(0.15)}>
          <h1 className="font-frank leading-[1.0] text-foreground mb-8">
            <span className="block text-[clamp(2.8rem,7.5vw,6.5rem)] font-black tracking-tight">
              הגוף קורא
            </span>
            <span className="block text-[clamp(2.8rem,7.5vw,6.5rem)] font-light tracking-tight text-primary/80">
              את הקירות
            </span>
          </h1>
        </motion.div>

        {/* Rule */}
        <motion.div {...fadeUp(0.28)} className="flex items-center gap-4 mb-8">
          <div className="flex-1 max-w-xs h-px bg-border" />
        </motion.div>

        {/* Subheadline */}
        <motion.p {...fadeUp(0.35)}
          className="font-heebo text-base md:text-lg text-muted-foreground leading-[1.8] max-w-md mb-14 font-light"
        >
          פלטפורמת מחקר לאנדוקרינולוגיה אדריכלית — מתרגמת את ההשפעה הביולוגית של סביבה בנויה לכלים ניתנים ליישום.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.45)} className="flex flex-wrap items-center gap-5 mb-24">
          <button className="bg-foreground text-background font-heebo font-medium px-8 py-3.5 text-sm tracking-wide hover:bg-foreground/85 transition-colors duration-300">
            גלה את הביופרופיל
          </button>
          <button className="font-heebo text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-border hover:decoration-muted-foreground">
            מאמרי מחקר →
          </button>
        </motion.div>

        {/* ── Stat strip ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-border pt-10"
        >
          {STATS.map((s, i) => (
            <div key={i} className={`py-6 ${i < 2 ? "sm:pl-10 sm:ml-0 sm:border-l sm:border-border" : ""} ${i > 0 ? "sm:pr-10 border-t sm:border-t-0 border-border" : ""}`}>
              <div className="flex items-baseline gap-3 mb-1.5">
                <span className="font-frank text-3xl md:text-4xl font-bold text-foreground tabular-nums">{s.value}</span>
              </div>
              <p className="font-heebo text-sm text-foreground/70 mb-1">{s.label}</p>
              <p className="font-heebo text-[10px] text-muted-foreground/60 italic">{s.note}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom border ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />

      {/* ── Scroll nudge ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-border/60" />
      </motion.div>
    </section>
  );
}