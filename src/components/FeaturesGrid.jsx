import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Leaf, Zap, HeartPulse, ArrowUp,
  Check, Upload, FileCheck, ScanLine,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import RadialGauge from "./charts/RadialGauge";
import ExposureChart from "./charts/ExposureChart";
import ComparisonBars from "./charts/ComparisonBars";

// ─── 1. Scanner ─────────────────────────────────────────────────────────────
const SCAN_RESULTS = [
  {
    type: "stress",
    Icon: AlertTriangle,
    title: "סביבת לחץ זוהתה",
    body: "Warning: Windowless space detected. Cortisol rising, HPA axis activated.",
    bg: "bg-stress-soft",
    border: "border-stress/40",
    dot: "bg-stress",
    text: "text-stress-foreground",
  },
  {
    type: "biophilic",
    Icon: Leaf,
    title: "סביבה ביופילית",
    body: "Optimal: Natural light and biophilic elements detected. Parasympathetic system calm.",
    bg: "bg-bio-soft",
    border: "border-bio/40",
    dot: "bg-bio",
    text: "text-bio-foreground",
  },
];

function ScannerCard() {
  const [state, setState] = useState("idle");
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
    <div className="relative p-9 md:p-10 h-full border-border bg-background">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">01</span>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">AR Scanner</span>
      </div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">ביופרופיל הורמונלי</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 font-light">
        סורק AR שמעריך אור טבעי, חומרים וצמחייה — ומתרגם את החלל שלך לפרופיל הורמונלי מדויק.
      </p>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleScan}
            className="inline-flex items-center gap-2 bg-foreground text-background font-heebo font-medium px-6 py-3 text-sm hover:bg-foreground/85 transition-colors"
          ><ScanLine className="w-4 h-4" strokeWidth={2} /> סרוק חדר</motion.button>
        )}
        {state === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="h-px w-full bg-border overflow-hidden">
              <motion.div className="h-full bg-foreground" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }} />
            </div>
            <p className="text-xs font-heebo text-muted-foreground">Scanning light, plants, materials{dots}</p>
          </motion.div>
        )}
        {state === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`border ${result.border} ${result.bg} p-5`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <result.Icon className={`w-4 h-4 ${result.text}`} strokeWidth={2} />
              <span className={`font-frank text-base font-bold ${result.text}`}>{result.title}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${result.dot} animate-pulse ml-auto`} />
            </div>
            <p className="text-xs text-muted-foreground font-heebo leading-[1.8] mb-4">{result.body}</p>
            <button onClick={handleReset} className="text-xs text-muted-foreground underline underline-offset-4 decoration-border hover:decoration-muted-foreground hover:text-foreground transition-colors font-heebo">
              סרוק שוב
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-accent/50" />
    </div>
  );
}

// ─── 2. Body Compass ────────────────────────────────────────────────────────
const ENV_DATA = {
  corridor: { hrv: 38, bp: 142, sc: 8.7, label: "מסדרון ללא חלונות" },
  biophilic: { hrv: 62, bp: 118, sc: 3.2, label: "משרד ביופילי" },
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
    <div className="relative p-9 md:p-10 h-full bg-background">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">02</span>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">Body Compass</span>
      </div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
        <HeartPulse className="w-5 h-5 text-accent" strokeWidth={2} /> מצפן גופני
      </h3>
      <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 font-light">
        ניטור HRV ותגובת ציר ה-HPA בזמן אמת.
      </p>

      {/* Toggle */}
      <div className="flex items-center gap-3 mb-8 text-sm font-heebo">
        <span className={env === "corridor" ? "text-stress font-medium" : "text-muted-foreground"}>מסדרון</span>
        <button
          onClick={() => setEnv(e => e === "corridor" ? "biophilic" : "corridor")}
          className={`relative w-11 h-5 transition-colors duration-400 border overflow-hidden ${env === "biophilic" ? "bg-bio/15 border-bio/30" : "bg-stress/10 border-stress/25"}`}
        >
          <motion.div
            animate={{ x: env === "biophilic" ? 2 : 26 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-0.5 w-3.5 h-3.5 ${env === "biophilic" ? "bg-bio" : "bg-stress"}`}
          />
        </button>
        <span className={env === "biophilic" ? "text-bio font-medium" : "text-muted-foreground"}>משרד ביופילי</span>
      </div>

      {/* Environment label */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 border text-xs font-heebo mb-5 ${
        env === "biophilic" ? "border-bio/30 bg-bio-soft text-bio-foreground" : "border-stress/30 bg-stress-soft text-stress-foreground"
      }`}>
        <div className={`w-1.5 h-1.5 ${env === "biophilic" ? "bg-bio" : "bg-stress"} animate-pulse`} />
        {data.label}
      </div>

      {/* Metrics: HRV gauge + two tiles */}
      <div className="flex items-center gap-5 mt-5">
        <RadialGauge value={data.hrv} min={20} max={80} tone={env === "biophilic" ? "bio" : "stress"} unit="HRV · ms">
          <AnimatedNumber value={data.hrv} />
        </RadialGauge>
        <div className="flex-1 grid grid-cols-1 gap-2">
          {metrics.slice(1).map((m) => (
            <div key={m.label} className="bg-secondary/40 px-3 py-2.5 border border-border/40 text-center">
              <p className={`font-frank text-lg font-bold tabular-nums ${
                env === "biophilic" ? "text-bio" : "text-stress"
              }`}>
                <AnimatedNumber value={m.value} decimals={m.decimals} />
              </p>
              <p className="text-[10px] text-muted-foreground font-heebo mt-0.5 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-accent/50" />
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
    <div className="relative p-9 md:p-10 h-full bg-background">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">03</span>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">Recovery Timer</span>
      </div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">החלמה ב-4 דקות</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 font-light">
        מבוסס תיאוריית ההחלמה הביופילית של אולריך (1984). ארבע דקות. שינוי מדיד.
      </p>

      <div className="flex items-baseline gap-2 mb-5">
        <span className="font-frank text-5xl font-bold text-foreground tabular-nums">{mm}:{ss}</span>
      </div>

      <div className="h-px w-full bg-border overflow-hidden mb-5">
        <motion.div className="h-full bg-foreground" style={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={phase.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-muted-foreground font-heebo leading-[1.8] mb-6 min-h-[2.5rem] font-light"
        >
          {(running || done) ? phase.text : "לחץ 'התחל' כדי להפעיל את תהליך ההחלמה."}
        </motion.p>
      </AnimatePresence>

      <div className="flex gap-3">
        {!running ? (
          <button onClick={handleStart} className="bg-foreground text-background font-heebo font-medium px-6 py-3 text-sm hover:bg-foreground/85 transition-colors">
            התחל החלמה
          </button>
        ) : (
          <button onClick={handleStop} className="border border-border text-muted-foreground font-heebo px-6 py-3 text-sm hover:border-foreground/30 hover:text-foreground transition-colors">
            עצור
          </button>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-accent/50 animate-moss-pulse" />
    </div>
  );
}

// ─── 4. ROI Calculator ─────────────────────────────────────────────────────
function ROICard() {
  const [employees, setEmployees] = useState(100);
  const [result, setResult] = useState(null);

  const handleCalc = () => {
    const avgSickDaysPerYear = 8;
    const avgDailyCostPerEmployee = 650; // ₪
    const reduction = 0.18;
    const savedDays = Math.round(employees * avgSickDaysPerYear * reduction);
    const savedCost = (savedDays * avgDailyCostPerEmployee).toLocaleString("he-IL");
    setResult({ savedDays, savedCost });
  };

  return (
    <div className="relative p-9 md:p-10 h-full bg-background">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">04</span>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">ROI Calculator</span>
      </div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">מחשבון חיסכון כלכלי</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 font-light">
        18% פחות ימי מחלה בסביבת עבודה עם אור יום תקני — מה זה שווה לארגון שלך?
      </p>

      <div className="mb-6">
        <label className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-heebo uppercase block mb-3">מספר עובדים</label>
        <input
          type="number" min="1" value={employees}
          onChange={e => { setEmployees(Number(e.target.value)); setResult(null); }}
          className="w-full bg-background border border-border px-4 py-3 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      <button onClick={handleCalc}
        className="bg-foreground text-background font-heebo font-medium px-6 py-3 text-sm hover:bg-foreground/85 transition-colors mb-6"
      >
        חשב כדאיות תאורה טבעית
      </button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="border border-border bg-secondary/30 p-5 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-heebo">ימי מחלה שנחסכים בשנה</span>
              <span className="font-frank text-2xl font-bold text-foreground">{result.savedDays}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-heebo">חיסכון כספי משוער לשנה</span>
              <span className="font-frank text-2xl font-bold text-foreground">₪{result.savedCost}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/50 font-heebo pt-1">
              * 8 ימי מחלה × ₪650 עלות יומית × 18% הפחתה
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-primary/40" />
    </div>
  );
}

// ─── 5. Demographic Vulnerability Map ───────────────────────────────────────
const DEMO_DATA = {
  male:   { label: "גבר",  cortisol: 38, bar: "bg-stress/50", desc: "רמת קורטיזול בסיסית מוגברת בסביבה נטולת ירוק." },
  female: { label: "אישה", cortisol: 74, bar: "bg-stress",    desc: "נשים מציגות תגובת HPA מוגברת משמעותית באותה סביבה." },
};

function DemographicCard() {
  const [gender, setGender] = useState("male");
  const data = DEMO_DATA[gender];

  return (
    <div className="relative p-9 md:p-10 h-full bg-background">
      <div className="flex items-center gap-3 mb-8">
        <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">05</span>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">Demographic Vulnerability</span>
      </div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-2">סימולטור פגיעות דמוגרפית</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-1 font-light">
        שכונה דלת ירוק — מי הגוף שסובל יותר?
      </p>
      <p className="font-heebo text-xs text-muted-foreground/50 italic mb-8">מחקרה של ד&quot;ר ג'ני רואי</p>

      <div className="flex items-center gap-3 mb-8 text-sm font-heebo">
        {["male", "female"].map(g => (
          <button key={g} onClick={() => setGender(g)}
            className={`px-5 py-2.5 border text-sm transition-all duration-300 ${
              gender === g ? "border-foreground/30 bg-secondary text-foreground" : "border-border text-muted-foreground hover:border-foreground/20"
            }`}
          >
            {DEMO_DATA[g].label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-muted-foreground font-heebo">קורטיזול בסיסי מדומה (nmol/L)</span>
          <motion.span key={data.cortisol} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-frank text-2xl font-bold text-stress flex items-center gap-1"
          >
            {gender === "female" && <ArrowUp className="w-4 h-4" strokeWidth={2.5} />}
            {data.cortisol}
          </motion.span>
        </div>
        <ComparisonBars
          max={90}
          items={[
            { label: DEMO_DATA.female.label, value: DEMO_DATA.female.cortisol, tone: "stress", active: gender === "female" },
            { label: DEMO_DATA.male.label, value: DEMO_DATA.male.cortisol, tone: "stress", active: gender === "male" },
          ]}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.p key={gender} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-sm font-heebo text-muted-foreground leading-[1.8] mb-5 font-light"
        >
          {data.desc}
        </motion.p>
      </AnimatePresence>

      <div className="border border-border bg-secondary/30 p-4">
        <p className="text-xs text-muted-foreground font-heebo leading-[1.8]">
          נשים בשכונות דלות בטבע מציגות רמות קורטיזול גבוהות משמעותית.
          <span className="text-foreground/70"> המרחב אינו ניטרלי.</span>
        </p>
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-foreground/20" />
    </div>
  );
}

// ─── 6. Brain Architecture Timeline ────────────────────────────────────────
const TIMELINE_LABELS = ["4 דקות", "שעה", "יום", "שבוע", "חודש", "שנה", "שנים"];
const PHASES = {
  biophilic: [
    "מערכת העצבים הפאראסימפתטית מופעלת.",
    "קורטיזול יורד. קצב לב מתייצב.",
    "מצב רוח ויצירתיות משתפרים.",
    "שינה עמוקה ואיכותית יותר.",
    "ביצועים קוגניטיביים בשיא.",
    "עמידות לסטרס גבוהה.",
    "✓ ארכיטקטורה מוחית מחוזקת. היפוקמפוס שגשג.",
  ],
  windowless: [
    "HPA axis מופעל. קורטיזול עולה.",
    "מתח מצטבר. ריכוז יורד.",
    "עייפות כרונית. מערכת חיסון נחלשת.",
    "הפרעות שינה. חרדה גוברת.",
    "דכאון מתפתח. ביצועים בירידה חדה.",
    "נזק מוחי מתחיל. גלוקוקורטיקואידים מצטברים.",
    null, // triggers severe warning
  ],
};

// Simulated "brain integrity" index (0–100) across the timeline.
const INTEGRITY = {
  biophilic: [55, 61, 68, 75, 82, 90, 97],
  windowless: [52, 45, 37, 29, 21, 12, 4],
};

function BrainTimelineCard() {
  const [sliderVal, setSliderVal] = useState(0);
  const [envType, setEnvType] = useState("biophilic");

  const isSevere = envType === "windowless" && sliderVal === 6;
  const phase = PHASES[envType][sliderVal];

  return (
    <div className={`relative p-9 md:p-10 col-span-1 md:col-span-2 border-t border-b transition-all duration-400 ${
      isSevere ? "bg-stress-soft/60 border-stress/30" : "bg-background border-border"
    }`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">06</span>
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[9px] tracking-[0.3em] text-muted-foreground/40 font-heebo uppercase">Brain Architecture Timeline</span>
        </div>
        <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">ציר זמן חשיפה כרונית</h3>
        <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 max-w-xl font-light">
          מה קורה למוח לאורך זמן — בסביבה ביופילית לעומת חדר ללא חלונות?
        </p>

        <div className="flex items-center gap-3 mb-10 text-sm font-heebo">
          {["biophilic", "windowless"].map(e => (
            <button key={e} onClick={() => setEnvType(e)}
              className={`px-5 py-2.5 border text-sm transition-all duration-300 flex items-center gap-2 ${
                envType === e
                  ? e === "biophilic"
                    ? "border-bio/40 bg-bio-soft text-bio-foreground"
                    : "border-stress/40 bg-stress-soft text-stress-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/20"
              }`}
            >
              {e === "biophilic" ? <Leaf className="w-3.5 h-3.5" strokeWidth={2} /> : <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />}
              {e === "biophilic" ? "ביופילי" : "חדר ללא חלונות"}
            </button>
          ))}
        </div>

        {/* Exposure chart */}
        <div className="mb-6 border border-border/60 bg-secondary/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] tracking-[0.3em] text-muted-foreground/50 font-heebo uppercase">Brain Integrity Index</span>
            <span className={`font-frank text-sm font-bold tabular-nums ${envType === "biophilic" ? "text-bio" : "text-stress"}`}>
              {INTEGRITY[envType][sliderVal]}<span className="text-muted-foreground/50 text-[10px]"> / 100</span>
            </span>
          </div>
          <ExposureChart
            biophilic={INTEGRITY.biophilic}
            windowless={INTEGRITY.windowless}
            activeType={envType}
            activeIndex={sliderVal}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-muted-foreground/50 font-heebo mb-2">
            {TIMELINE_LABELS.map(l => <span key={l}>{l}</span>)}
          </div>
          <input type="range" min="0" max="6" step="1" value={sliderVal}
            onChange={e => setSliderVal(Number(e.target.value))}
            className={`w-full cursor-pointer ${envType === "biophilic" ? "accent-bio" : "accent-stress"}`}
          />
        </div>

        <AnimatePresence mode="wait">
          {isSevere ? (
            <motion.div key="severe" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="border border-stress/40 bg-stress-soft p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-stress animate-pulse" strokeWidth={2.5} />
                <span className="text-[10px] tracking-[0.3em] text-stress-foreground font-heebo uppercase">אזהרה קלינית</span>
              </div>
              <p className="font-frank text-lg text-stress-foreground leading-relaxed">
                אזהרה: חשיפה כרונית לסטרס סביבתי משנה את הארכיטקטורה המוחית. גלוקוקורטיקואידים פוגעים כעת בהיפוקמפוס, באמיגדלה ובקורטקס הפרה-פרונטלי.
              </p>
            </motion.div>
          ) : (
            <motion.div key={`${envType}-${sliderVal}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`border p-6 ${
                envType === "biophilic" ? "border-bio/25 bg-bio-soft/50" : "border-stress/25 bg-stress-soft/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 animate-pulse ${envType === "biophilic" ? "bg-bio" : "bg-stress"}`} />
                <span className={`text-[10px] font-heebo font-medium tracking-wider ${
                  envType === "biophilic" ? "text-bio-foreground" : "text-stress-foreground"
                }`}>{TIMELINE_LABELS[sliderVal]}</span>
              </div>
              <p className="font-heebo text-sm leading-[1.9] text-foreground/75 font-light">{phase}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-px bg-accent/40" />
    </div>
  );
}

// ─── 7. Blueprint Certification ────────────────────────────────────────────
const BUILDING_TYPES = [
  { value: "hospital", label: "בית חולים" },
  { value: "school",   label: "בית ספר" },
  { value: "residential", label: "מגורים" },
];

function BlueprintCard() {
  const [buildingType, setBuildingType] = useState("hospital");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [state, setState] = useState("idle"); // idle | analyzing | certified
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (state !== "analyzing") return;
    const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    const timer = setTimeout(() => { clearInterval(dotInterval); setState("certified"); }, 2000);
    return () => { clearInterval(dotInterval); clearTimeout(timer); };
  }, [state]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleGenerate = () => { setState("analyzing"); setDots(""); };
  const handleReset    = () => { setState("idle"); setFileName(null); };

  return (
    <div className="relative overflow-hidden col-span-1 md:col-span-2 border border-border bg-card hover:border-primary/20 transition-all duration-500 p-9 md:p-12">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">07</span>
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground/50 font-heebo uppercase">Blueprint Certification</span>
        </div>
        <h3 className="font-frank text-2xl md:text-3xl font-bold text-foreground mb-3">אישור שרטוט ותעודת ביופרופיל הורמונלי</h3>
        <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-10 max-w-xl font-light">
          הגבול הבא הוא בשרטוט. בקרוב תוכניות בנייה ידרשו ביופרופיל הורמונלי לצד יעילות אנרגטית.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Dropzone */}
          <div>
            <label className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-heebo uppercase block mb-3">העלאת שרטוט אדריכלי</label>
            <label
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed cursor-pointer transition-all duration-300 py-10 px-4 ${
                dragging
                  ? "border-accent/60 bg-accent/5"
                  : fileName
                  ? "border-accent/40 bg-accent/[0.03]"
                  : "border-border hover:border-muted-foreground/40 bg-secondary/30"
              }`}
            >
              <input type="file" className="hidden" accept=".pdf,.dwg,.png,.jpg" onChange={handleFileInput} />
              <div className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                fileName ? "border-bio/50 text-bio" : "border-border text-muted-foreground"
              }`}>
                {fileName ? <FileCheck className="w-4 h-4" strokeWidth={2} /> : <Upload className="w-4 h-4" strokeWidth={2} />}
              </div>
              <span className="text-xs font-heebo text-muted-foreground text-center">
                {fileName ? fileName : "גרור קובץ לכאן — PDF, DWG, PNG"}
              </span>
              {fileName && (
                <span className="inline-flex items-center gap-1 text-[10px] text-bio font-heebo tracking-wider">
                  <Check className="w-3 h-3" strokeWidth={3} /> קובץ נטען
                </span>
              )}
            </label>
          </div>

          {/* Building type + action */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <label className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-heebo uppercase block mb-3">סוג מבנה</label>
              <select
                value={buildingType}
                onChange={e => setBuildingType(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/40 transition-colors"
              >
                {BUILDING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {state === "idle" && (
              <button
                onClick={handleGenerate}
                className="bg-foreground text-background font-heebo font-medium px-6 py-3.5 text-sm tracking-wide hover:bg-foreground/85 transition-colors duration-300"
              >
                הפק דוח תקן אנדוקריני
              </button>
            )}

            {state === "analyzing" && (
              <div className="space-y-3">
                <div className="h-px w-full bg-border overflow-hidden">
                  <motion.div className="h-full bg-foreground" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} />
                </div>
                <p className="text-xs font-heebo text-muted-foreground">מנתח מסלולי אור טבעי וחומרי גלם{dots}</p>
              </div>
            )}
          </div>
        </div>

        {/* Certificate */}
        <AnimatePresence>
          {state === "certified" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative border border-accent/30 bg-accent/[0.03] p-8 md:p-10"
            >
              {/* Corner marks */}
              <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-accent/30" />
              <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-accent/30" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-accent/30" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-accent/30" />

              <div className="text-center">
                <div className="inline-flex items-center gap-2 border border-accent/25 px-5 py-1.5 mb-6">
                  <div className="w-1.5 h-1.5 bg-accent animate-moss-pulse" />
                  <span className="text-[9px] tracking-[0.35em] text-accent/80 font-heebo uppercase">Certified — Architectural Endocrinology Standard</span>
                </div>
                <h4 className="font-frank text-2xl md:text-3xl font-bold text-foreground mb-4 leading-snug">
                  תעודת ביופרופיל הורמונלי: השרטוט אושר.
                </h4>
                <p className="font-heebo text-sm text-muted-foreground leading-[1.9] max-w-lg mx-auto font-light">
                  המבנה תומך באיזון ציר HPA. עומד בתקן האנדוקרינולוגיה האדריכלית, ומקדם החלמה פיזיולוגית והורדת קורטיזול.
                </p>
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border flex-wrap gap-4">
                <div className="flex gap-6 text-[10px] text-muted-foreground/60 font-heebo">
                  <span>סוג מבנה: <span className="text-foreground/70">{BUILDING_TYPES.find(t => t.value === buildingType)?.label}</span></span>
                  <span>תאריך: <span className="text-foreground/70">{new Date().toLocaleDateString("he-IL")}</span></span>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => window.print()}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors font-heebo border border-border px-4 py-2 hover:border-muted-foreground/40"
                  >
                    ייצא תעודה
                  </button>
                  <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border transition-colors font-heebo">
                    איפוס
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Section divider helper ──────────────────────────────────────────────────
function SectionDivider({ label, sub }) {
  return (
    <div className="max-w-6xl mx-auto my-24 md:my-32 px-8 md:px-20">
      <div className="border-t border-border pt-10 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-[0.4em] text-muted-foreground/40 font-heebo uppercase mb-1">{sub}</p>
          <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground">{label}</h3>
        </div>
        <div className="w-2 h-2 bg-border" />
      </div>
    </div>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────
export default function FeaturesGrid() {
  return (
    <section className="relative border-t border-border" dir="rtl">

      {/* ── Core tools ── */}
      <div className="py-24 md:py-36 px-8 md:px-20">
        <div className="max-w-6xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-accent" />
            <span className="text-[10px] tracking-[0.35em] text-muted-foreground/60 font-heebo uppercase">Research Tools</span>
          </div>
          <h2 className="font-frank text-3xl md:text-4xl font-bold text-foreground leading-tight">
            כלי מחקר<br />
            <span className="font-light">ואבחון סביבתי</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <div className="bg-background"><ScannerCard /></div>
          <div className="bg-background"><CompassCard /></div>
          <div className="bg-background"><TimerCard /></div>
          <div className="bg-background">
            <FeatureCard
              icon={Zap}
              title="אתגר השעה"
              description='שאל את עצמך: ״מה החדר הזה אומר לגוף שלי?״ — משימות יומיות שמחדדות את המודעות הסביבתית שלך.'
              index={3}
            />
          </div>
        </div>
      </div>

      <SectionDivider label="מודולים מתקדמים" sub="Advanced Modules" />

      {/* ── Advanced modules ── */}
      <div className="px-8 md:px-20 pb-24 md:pb-36">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <div className="bg-background"><ROICard /></div>
          <div className="bg-background"><DemographicCard /></div>
          <div className="bg-background col-span-1 md:col-span-2"><BrainTimelineCard /></div>
        </div>
      </div>

      <SectionDivider label="הגבול הבא" sub="The Next Frontier" />

      {/* ── Blueprint ── */}
      <div className="px-8 md:px-20 pb-24 md:pb-36">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <div className="bg-background col-span-1 md:col-span-2"><BlueprintCard /></div>
        </div>
      </div>

    </section>
  );
}