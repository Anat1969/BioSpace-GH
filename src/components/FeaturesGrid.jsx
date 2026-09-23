import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Leaf, HeartPulse, ArrowUp, ScanLine } from "lucide-react";
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

export function ScannerCard() {
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

export function CompassCard() {
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

export function TimerCard() {
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
export function ROICard() {
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

export function DemographicCard() {
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

export function BrainTimelineCard() {
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


// Individual module cards are exported above and composed into the conceptual
// narrative (acts) in src/pages/Home.jsx via StorySection.