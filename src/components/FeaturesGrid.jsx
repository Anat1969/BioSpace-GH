import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeatureCard from "./FeatureCard";

// ─── 1. Scanner ─────────────────────────────────────────────────────────────
const SCAN_RESULTS = [
  {
    type: "stress",
    icon: "⚠️",
    title: "סביבת לחץ זוהתה",
    body: "Warning: Windowless space detected. Cortisol rising, HPA axis activated.",
    bg: "from-red-950/60 to-amber-950/40",
    border: "border-amber-700/50",
    dot: "bg-amber-500",
    text: "text-amber-300",
  },
  {
    type: "biophilic",
    icon: "🌿",
    title: "סביבה ביופילית",
    body: "Optimal: Natural light and biophilic elements detected. Parasympathetic system calm.",
    bg: "from-emerald-950/60 to-teal-950/40",
    border: "border-emerald-600/50",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
];

function ScannerCard() {
  const [state, setState] = useState("idle"); // idle | scanning | result
  const [result, setResult] = useState(null);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (state !== "scanning") return;
    const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    const timer = setTimeout(() => {
      clearInterval(dotInterval);
      setResult(SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)]);
      setState("result");
    }, 3000);
    return () => { clearInterval(dotInterval); clearTimeout(timer); };
  }, [state]);

  const handleScan = () => { setState("scanning"); setResult(null); setDots(""); };
  const handleReset = () => { setState("idle"); setResult(null); };

  return (
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 h-full border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/30 transition-all duration-700">
      <div className="mb-6 text-3xl">🔬</div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">ביופרופיל הורמונלי</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-6">
        סורק AR שמעריך אור טבעי, חומרים וצמחייה — ומתרגם את החלל שלך לפרופיל הורמונלי מדויק.
      </p>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button
            key="btn"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleScan}
            className="bg-primary text-primary-foreground font-heebo font-medium px-6 py-2.5 rounded-sm text-sm hover:bg-primary/85 transition-all duration-300"
          >
            סרוק חדר
          </motion.button>
        )}

        {state === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Scanning bar */}
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
            <p className="text-sm font-heebo text-muted-foreground">
              Scanning light, plants, materials{dots}
            </p>
          </motion.div>
        )}

        {state === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`rounded-sm p-4 border bg-gradient-to-br ${result.bg} ${result.border}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${result.dot} animate-pulse`} />
              <span className={`font-frank text-base font-bold ${result.text}`}>{result.icon} {result.title}</span>
            </div>
            <p className="text-xs text-foreground/70 font-heebo leading-relaxed mb-3">{result.body}</p>
            <button onClick={handleReset} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors font-heebo">
              סרוק שוב
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0" />
    </div>
  );
}

// ─── 2. Body Compass ────────────────────────────────────────────────────────
const ENV_DATA = {
  corridor: { hrv: 38, bp: 142, sc: 8.7, label: "מסדרון ללא חלונות", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-700/30" },
  biophilic: { hrv: 62, bp: 118, sc: 3.2, label: "משרד ביופילי", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-700/30" },
};

function AnimatedNumber({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    if (ref.current) cancelAnimationFrame(ref.current);
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((start + (end - start) * eased).toFixed(decimals)));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);

  return <span>{display}</span>;
}

function CompassCard() {
  const [env, setEnv] = useState("corridor");
  const data = ENV_DATA[env];

  const metrics = [
    { label: "HRV (ms)", value: data.hrv, decimals: 0 },
    { label: "לחץ דם סיסטולי", value: data.bp, decimals: 0 },
    { label: "מוליכות עור (μS)", value: data.sc, decimals: 1 },
  ];

  return (
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 h-full border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/30 transition-all duration-700">
      <div className="mb-6 text-3xl">🧭</div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">מצפן גופני</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-6">
        מסתנכרן עם שעונים חכמים לניטור HRV ותגובת ציר ה-HPA בזמן אמת.
      </p>

      {/* Toggle */}
      <div className="flex items-center gap-3 mb-6 text-sm font-heebo">
        <span className={env === "corridor" ? "text-amber-400 font-medium" : "text-muted-foreground"}>
          מסדרון
        </span>
        <button
          onClick={() => setEnv(e => e === "corridor" ? "biophilic" : "corridor")}
          className={`relative w-12 h-6 rounded-full transition-colors duration-500 ${env === "biophilic" ? "bg-emerald-600/60" : "bg-amber-700/50"}`}
        >
          <motion.div
            animate={{ x: env === "biophilic" ? 24 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 bg-foreground rounded-full"
          />
        </button>
        <span className={env === "biophilic" ? "text-emerald-400 font-medium" : "text-muted-foreground"}>
          משרד ביופילי
        </span>
      </div>

      {/* Environment label */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border text-xs font-heebo mb-4 ${data.bg} ${data.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${env === "biophilic" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
        {data.label}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-background/60 rounded-sm p-3 border border-border/40 text-center">
            <p className={`font-frank text-xl font-bold ${data.color} tabular-nums`}>
              <AnimatedNumber value={m.value} decimals={m.decimals} />
            </p>
            <p className="text-[10px] text-muted-foreground font-heebo mt-1 leading-tight">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0" />
    </div>
  );
}

// ─── 3. Recovery Timer ──────────────────────────────────────────────────────
const RECOVERY_PHASES = [
  { at: 240, text: "מתחיל תהליך... מערכת העצבים הפאראסימפתטית מופעלת." },
  { at: 200, text: "קצב הלב יורד בהדרגה..." },
  { at: 160, text: "Ulrich (1984): צפייה בטבע מאיצה התאוששות פיזיולוגית." },
  { at: 120, text: "קורטיזול בירידה. מוליכות עור יורדת." },
  { at: 80,  text: "Brain shifting to default mode. Rumination fading." },
  { at: 40,  text: "הנשימה מעמיקה. מתח שרירי פוחת." },
  { at: 0,   text: "✓ החלמה הושלמה. הגוף מאוזן." },
];

function TimerCard() {
  const [seconds, setSeconds] = useState(240);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) { setRunning(false); setDone(true); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  const handleStart = () => { setSeconds(240); setRunning(true); setDone(false); };
  const handleStop  = () => { setRunning(false); };

  const phase = RECOVERY_PHASES.slice().reverse().find(p => seconds <= p.at) || RECOVERY_PHASES[0];
  const progress = ((240 - seconds) / 240) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 h-full border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/30 transition-all duration-700">
      <div className="mb-6 text-3xl">🌿</div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">החלמה ב-4 דקות</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-6">
        סימולטור VR מבוסס תיאוריית ההחלמה הביופילית של רוג'ר אולריך. ארבע דקות. שינוי מדיד.
      </p>

      {/* Timer display */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-frank text-5xl font-bold text-foreground tabular-nums">{mm}:{ss}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-border rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-primary"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Phase text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={phase.text}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-accent-foreground/80 font-heebo leading-relaxed mb-5 min-h-[2.5rem]"
        >
          {(running || done) ? phase.text : "לחץ 'התחל' כדי להפעיל את תהליך ההחלמה."}
        </motion.p>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3">
        {!running ? (
          <button onClick={handleStart} className="bg-accent/80 hover:bg-accent text-accent-foreground font-heebo font-medium px-6 py-2.5 rounded-sm text-sm transition-all duration-300">
            התחל החלמה
          </button>
        ) : (
          <button onClick={handleStop} className="border border-border text-muted-foreground font-heebo px-6 py-2.5 rounded-sm text-sm hover:border-primary/40 hover:text-foreground transition-all duration-300">
            עצור
          </button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0 animate-moss-pulse" />
    </div>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export default function FeaturesGrid() {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12" dir="rtl">
      <div className="max-w-6xl mx-auto mb-16 md:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="text-xs tracking-[0.2em] text-accent-foreground/60 font-heebo">יכולות מרכזיות</span>
        </div>
        <h2 className="font-frank text-3xl md:text-4xl font-bold text-foreground">
          הכלים שמחברים<span className="text-primary"> בין גוף למרחב</span>
        </h2>
      </div>

      {/* Asymmetric grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="md:translate-y-8"><ScannerCard /></div>
        <div><CompassCard /></div>
        <div><TimerCard /></div>
        <div className="md:-translate-y-8">
          <FeatureCard
            icon="⚡"
            title="אתגר השעה"
            description='שאל את עצמך: ״מה החדר הזה אומר לגוף שלי?״ — משימות יומיות שמחדדות את המודעות הסביבתית שלך.'
            index={3}
          />
        </div>
      </div>
    </section>
  );
}