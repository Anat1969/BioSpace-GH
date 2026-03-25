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
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 h-full border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/30 transition-all duration-700">
      <div className="mb-6 text-3xl">💼</div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">מחשבון חיסכון כלכלי</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-6">
        18% פחות ימי מחלה בסביבת עבודה עם אור יום תקין — מה זה שווה לארגון שלך?
      </p>

      <div className="mb-4">
        <label className="text-xs text-muted-foreground font-heebo block mb-2">מספר עובדים</label>
        <input
          type="number"
          min="1"
          value={employees}
          onChange={e => { setEmployees(Number(e.target.value)); setResult(null); }}
          className="w-full bg-background/60 border border-border/60 rounded-sm px-4 py-2.5 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <button
        onClick={handleCalc}
        className="bg-primary text-primary-foreground font-heebo font-medium px-6 py-2.5 rounded-sm text-sm hover:bg-primary/85 transition-all duration-300 mb-5"
      >
        חשב כדאיות תאורה טבעית
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-sm border border-primary/30 bg-primary/5 p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-heebo">ימי מחלה שנחסכים בשנה</span>
              <span className="font-frank text-2xl font-bold text-primary">{result.savedDays}</span>
            </div>
            <div className="h-[1px] bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground font-heebo">חיסכון כספי משוער לשנה</span>
              <span className="font-frank text-2xl font-bold text-primary">₪{result.savedCost}</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-heebo pt-1">
              * מחושב לפי 8 ימי מחלה ממוצע לעובד × ₪650 עלות יומית × 18% הפחתה (מחקר אור יום)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />
    </div>
  );
}

// ─── 5. Demographic Vulnerability Map ───────────────────────────────────────
const DEMO_DATA = {
  male:   { label: "גבר",  cortisol: 38, color: "text-amber-400",   bar: "bg-amber-500",   desc: "רמת קורטיזול בסיסית מוגברת בסביבה נטולת ירוק." },
  female: { label: "אישה", cortisol: 74, color: "text-red-400",     bar: "bg-red-500",     desc: "נשים מציגות תגובת HPA מוגברת משמעותית באותה סביבה." },
};

function DemographicCard() {
  const [gender, setGender] = useState("male");
  const data = DEMO_DATA[gender];

  return (
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 h-full border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/30 transition-all duration-700">
      <div className="mb-6 text-3xl">🗺️</div>
      <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">סימולטור פגיעות דמוגרפית</h3>
      <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-2">
        שכונה דלת ירוק — מי הגוף שסובל יותר?
      </p>
      <p className="font-heebo text-xs text-muted-foreground/60 italic mb-6">
        מחקרה של ד&quot;ר ג&apos;ני רואי
      </p>

      {/* Toggle */}
      <div className="flex items-center gap-3 mb-6 text-sm font-heebo">
        {["male", "female"].map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`px-5 py-2 rounded-sm border text-sm font-medium transition-all duration-300 ${
              gender === g
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
          >
            {DEMO_DATA[g].label}
          </button>
        ))}
      </div>

      {/* Cortisol bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground font-heebo">קורטיזול בסיסי מדומה</span>
          <motion.span
            key={data.cortisol}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`font-frank text-xl font-bold ${data.color}`}
          >
            {data.cortisol} nmol/L
          </motion.span>
        </div>
        <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${data.cortisol}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${data.bar}`}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={gender}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={`text-xs font-heebo leading-relaxed mb-4 ${data.color}`}
        >
          {data.desc}
        </motion.p>
      </AnimatePresence>

      <div className="rounded-sm border border-border/40 bg-background/40 p-4">
        <p className="text-xs text-muted-foreground font-heebo leading-relaxed">
          נשים בשכונות דלות בטבע מציגות רמות קורטיזול גבוהות משמעותית.
          <span className="text-foreground/70"> המרחב אינו ניטרלי.</span>
        </p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0" />
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

function BrainTimelineCard() {
  const [sliderVal, setSliderVal] = useState(0);
  const [envType, setEnvType] = useState("biophilic");

  const isSevere = envType === "windowless" && sliderVal === 6;
  const phase = PHASES[envType][sliderVal];

  return (
    <div className={`relative overflow-hidden rounded-sm p-8 md:p-10 col-span-1 md:col-span-2 border transition-all duration-700 bg-gradient-to-br from-card via-card to-secondary/30 ${
      isSevere ? "border-red-800/60" : "border-border/60 hover:border-primary/30"
    }`}>
      {/* Severe warning glow */}
      {isSevere && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-background to-amber-950/30 pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="mb-6 text-3xl">🧠</div>
        <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">ציר זמן חשיפה כרונית</h3>
        <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-6">
          מה קורה למוח לאורך זמן — בסביבה ביופילית לעומת חדר ללא חלונות?
        </p>

        {/* Env toggle */}
        <div className="flex items-center gap-3 mb-8 text-sm font-heebo">
          {[("biophilic"), ("windowless")].map(e => (
            <button
              key={e}
              onClick={() => setEnvType(e)}
              className={`px-5 py-2 rounded-sm border text-sm font-medium transition-all duration-300 ${
                envType === e
                  ? e === "biophilic"
                    ? "border-emerald-600/60 bg-emerald-500/10 text-emerald-400"
                    : "border-red-700/60 bg-red-500/10 text-red-400"
                  : "border-border/40 text-muted-foreground hover:border-border"
              }`}
            >
              {e === "biophilic" ? "ביופילי" : "חדר ללא חלונות"}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] text-muted-foreground font-heebo mb-2">
            {TIMELINE_LABELS.map(l => <span key={l}>{l}</span>)}
          </div>
          <input
            type="range" min="0" max="6" step="1"
            value={sliderVal}
            onChange={e => setSliderVal(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        {/* Phase display */}
        <AnimatePresence mode="wait">
          {isSevere ? (
            <motion.div
              key="severe"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-sm border border-red-800/60 bg-red-950/40 p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-heebo font-bold tracking-wider">אזהרה קלינית</span>
              </div>
              <p className="font-frank text-base md:text-lg text-red-300 leading-relaxed">
                אזהרה: חשיפה כרונית לסטרס סביבתי משנה את הארכיטקטורה המוחית.
                גלוקוקורטיקואידים פוגעים כעת בהיפוקמפוס, באמיגדלה ובקורטקס הפרה-פרונטלי.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${envType}-${sliderVal}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`rounded-sm border p-5 ${
                envType === "biophilic"
                  ? "border-emerald-700/40 bg-emerald-950/30"
                  : "border-amber-700/40 bg-amber-950/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  envType === "biophilic" ? "bg-emerald-400" : "bg-amber-500"
                }`} />
                <span className={`text-xs font-heebo font-bold ${
                  envType === "biophilic" ? "text-emerald-400" : "text-amber-400"
                }`}>{TIMELINE_LABELS[sliderVal]}</span>
              </div>
              <p className={`font-heebo text-sm leading-relaxed ${
                envType === "biophilic" ? "text-emerald-300/90" : "text-amber-300/90"
              }`}>{phase}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${
        isSevere ? "via-red-700/60" : envType === "biophilic" ? "via-accent/60" : "via-amber-700/40"
      } to-transparent`} />
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
    <div className="relative overflow-hidden rounded-sm p-8 md:p-10 col-span-1 md:col-span-2 border border-border/60 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-emerald-700/30 transition-all duration-700">
      <div className="relative z-10">
        <div className="mb-6 text-3xl">📐</div>
        <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3">אישור שרטוט ותעודת ביופרופיל הורמונלי</h3>
        <p className="font-heebo text-sm text-muted-foreground leading-relaxed mb-8">
          הגבול הבא הוא בשרטוט. בקרוב תוכניות בנייה ידרשו ביופרופיל הורמונלי לצד יעילות אנרגטית.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Dropzone */}
          <div>
            <label className="text-xs text-muted-foreground font-heebo block mb-2">העלה שרטוט אדריכלי</label>
            <label
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed cursor-pointer transition-all duration-300 py-8 px-4 ${
                dragging
                  ? "border-emerald-500/70 bg-emerald-950/30"
                  : fileName
                  ? "border-emerald-600/50 bg-emerald-950/20"
                  : "border-border/50 hover:border-emerald-700/40 bg-background/30"
              }`}
            >
              <input type="file" className="hidden" accept=".pdf,.dwg,.png,.jpg" onChange={handleFileInput} />
              <span className="text-2xl">{fileName ? "📄" : "⬆️"}</span>
              <span className="text-xs font-heebo text-muted-foreground text-center">
                {fileName ? fileName : "גרור שרטוט לכאן או לחץ לבחירת קובץ"}
              </span>
              {fileName && <span className="text-[10px] text-emerald-400 font-heebo">✓ קובץ נטען</span>}
            </label>
          </div>

          {/* Building type */}
          <div>
            <label className="text-xs text-muted-foreground font-heebo block mb-2">סוג מבנה</label>
            <select
              value={buildingType}
              onChange={e => setBuildingType(e.target.value)}
              className="w-full bg-background/60 border border-border/60 rounded-sm px-4 py-2.5 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/50 transition-colors mb-4"
            >
              {BUILDING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>

            {state === "idle" && (
              <button
                onClick={handleGenerate}
                className="w-full bg-emerald-800/70 hover:bg-emerald-700/70 text-emerald-100 font-heebo font-medium px-6 py-3 rounded-sm text-sm transition-all duration-300 border border-emerald-700/40"
              >
                הפק דוח תקן אנדוקריני
              </button>
            )}

            {state === "analyzing" && (
              <div className="space-y-3">
                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full bg-emerald-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "linear" }} />
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
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-sm border border-emerald-600/50 bg-gradient-to-br from-emerald-950/60 via-card to-teal-950/30 p-6 md:p-8 overflow-hidden"
            >
              {/* Corner ornaments */}
              <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-500/40" />
              <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-500/40" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-500/40" />
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-500/40" />

              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-sm px-4 py-1.5 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] tracking-[0.25em] text-emerald-400 font-heebo uppercase">Certified — Architectural Endocrinology Standard</span>
                </div>
                <h4 className="font-frank text-xl md:text-2xl font-bold text-emerald-300 mb-2">
                  תעודת ביופרופיל הורמונלי: השרטוט אושר.
                </h4>
                <p className="font-heebo text-sm text-foreground/75 leading-relaxed max-w-xl mx-auto">
                  המבנה תומך באיזון ציר HPA. עומד בתקן האנדוקרינולוגיה האדריכלית, ומקדם החלמה פיזיולוגית והורדת קורטיזול.
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-emerald-700/30">
                <div className="flex gap-4 text-[10px] text-muted-foreground font-heebo">
                  <span>סוג מבנה: <span className="text-emerald-400">{BUILDING_TYPES.find(t => t.value === buildingType)?.label}</span></span>
                  <span>תאריך: <span className="text-emerald-400">{new Date().toLocaleDateString("he-IL")}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 transition-colors font-heebo border border-border/40 hover:border-emerald-700/40 px-3 py-1.5 rounded-sm"
                  >
                    <span>🖨️</span> ייצא תעודה
                  </button>
                  <button onClick={handleReset} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors font-heebo">
                    איפוס
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />
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

      {/* Row 1: core features */}
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

      {/* Section divider — Advanced */}
      <div className="max-w-6xl mx-auto my-20 md:my-28">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-l from-border to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-xs tracking-[0.2em] text-accent-foreground/50 font-heebo">מודולים מתקדמים</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-border to-transparent" />
        </div>
      </div>

      {/* Row 2: advanced modules */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <ROICard />
        <DemographicCard />
        <BrainTimelineCard />
      </div>

      {/* Section divider — Frontier */}
      <div className="max-w-6xl mx-auto my-20 md:my-28">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-l from-border to-transparent" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-emerald-700/50" />
            <span className="text-xs tracking-[0.2em] text-emerald-500/50 font-heebo">הגבול הבא</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-border to-transparent" />
        </div>
      </div>

      {/* Row 3: blueprint certification */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <BlueprintCard />
      </div>
    </section>
  );
}