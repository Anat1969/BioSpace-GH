import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck, KeyRound, Loader2, FileText, AlertTriangle, Sparkles } from "lucide-react";
import { analyzeBlueprint, MODELS } from "../lib/analyzeBlueprint";
import BlueprintReport from "./BlueprintReport";

const BUILDING_TYPES = [
  { value: "בית חולים", label: "בית חולים" },
  { value: "בית ספר", label: "בית ספר" },
  { value: "מגורים", label: "מגורים" },
  { value: "משרדים", label: "משרדים" },
  { value: "מבנה ציבור", label: "מבנה ציבור" },
];

const KEY_LS = "bio_anthropic_key";
const MODEL_LS = "bio_anthropic_model";

const readLS = (k, d = "") => {
  try { return localStorage.getItem(k) || d; } catch { return d; }
};
const writeLS = (k, v) => {
  try { localStorage.setItem(k, v); } catch { /* ignore */ }
};

// Read a File into { base64, mediaType, previewUrl }.
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("קריאת הקובץ נכשלה."));
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      const header = result.slice(0, comma);
      const base64 = result.slice(comma + 1);
      const mediaType = header.slice(header.indexOf(":") + 1, header.indexOf(";"));
      resolve({ base64, mediaType, previewUrl: result });
    };
    reader.readAsDataURL(file);
  });
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export default function BlueprintCard() {
  const [apiKey, setApiKey] = useState(() => readLS(KEY_LS));
  const [model, setModel] = useState(() => readLS(MODEL_LS, MODELS[0].id));
  const [showKey, setShowKey] = useState(false);
  const [buildingType, setBuildingType] = useState(BUILDING_TYPES[0].value);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null); // { name, base64, mediaType, previewUrl }
  const [state, setState] = useState("idle"); // idle | analyzing | done | error
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onKey = (v) => { setApiKey(v); writeLS(KEY_LS, v); };
  const onModel = (v) => { setModel(v); writeLS(MODEL_LS, v); };

  const ingest = async (f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("פורמט לא נתמך לניתוח. העלי תמונה (PNG/JPG/WEBP) או PDF. (DWG אינו נתמך לניתוח חזותי.)");
      setState("error");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError("הקובץ גדול מדי (מקסימום 20MB).");
      setState("error");
      return;
    }
    try {
      const data = await readFile(f);
      setFile({ name: f.name, ...data });
      setError("");
      if (state === "error") setState("idle");
    } catch (e) {
      setError(e.message);
      setState("error");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    ingest(e.dataTransfer?.files?.[0]);
  };

  const generate = async () => {
    if (!apiKey.trim()) { setError("נדרש מפתח API של Anthropic כדי להפיק דוח אמיתי."); setState("error"); setShowKey(true); return; }
    if (!file) { setError("יש להעלות שרטוט (תמונה או PDF) לפני הפקת הדוח."); setState("error"); return; }
    setError("");
    setState("analyzing");
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const result = await analyzeBlueprint({
        apiKey: apiKey.trim(),
        model,
        base64: file.base64,
        mediaType: file.mediaType,
        buildingType,
        signal: abortRef.current.signal,
      });
      setReport(result);
      setState("done");
      setReportOpen(true);
    } catch (e) {
      if (e.name === "AbortError") return;
      setError(e.message || "הניתוח נכשל. נסי שוב.");
      setState("error");
    }
  };

  const isPdf = file?.mediaType === "application/pdf";

  return (
    <div className="relative overflow-hidden col-span-1 md:col-span-2 border border-border bg-card hover:border-primary/20 transition-all duration-500 p-9 md:p-12">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums">07</span>
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground/50 font-heebo uppercase">Blueprint Analysis</span>
        </div>
        <h3 className="font-frank text-2xl md:text-3xl font-bold text-foreground mb-3">ניתוח שרטוט ותעודת ביופרופיל הורמונלי</h3>
        <p className="font-heebo text-sm text-muted-foreground leading-[1.8] mb-8 max-w-2xl font-light">
          העלי תמונה או PDF של שרטוט אדריכלי — והמערכת תפיק <span className="text-foreground/80">דוח אמיתי ומובנה</span> על עמוד A4:
          ציוני פרמטרים סביבתיים, פרשנות פיזיולוגית והמלצות, מנותחים על ידי Claude Vision.
        </p>

        {/* API key */}
        <div className="mb-6 border border-border bg-secondary/20 p-4">
          <label className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-muted-foreground/70 font-heebo uppercase mb-2">
            <KeyRound className="w-3.5 h-3.5" strokeWidth={2} /> מפתח Anthropic API
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onKey(e.target.value)}
              placeholder="sk-ant-…"
              autoComplete="off" spellCheck={false}
              className="flex-1 bg-background border border-border px-3 py-2.5 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/40 transition-colors ltr:text-left"
              dir="ltr"
            />
            <button onClick={() => setShowKey((s) => !s)} className="text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-2 font-heebo transition-colors">
              {showKey ? "הסתר" : "הצג"}
            </button>
            <select
              value={model} onChange={(e) => onModel(e.target.value)}
              className="bg-background border border-border px-3 py-2.5 text-foreground font-heebo text-xs focus:outline-none focus:border-primary/40"
            >
              {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <p className="text-[10px] text-muted-foreground/60 font-heebo mt-2 leading-5">
            המפתח נשמר מקומית בדפדפן שלך בלבד (localStorage) ונשלח ישירות ל‑Anthropic — לא נשמר בשרת ולא בקוד.
            להשגת מפתח: console.anthropic.com. עלות משוערת לדוח: מספר סנטים.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Dropzone */}
          <div>
            <label className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-heebo uppercase block mb-3">העלאת שרטוט (תמונה / PDF)</label>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed cursor-pointer transition-all duration-300 py-8 px-4 ${
                dragging ? "border-bio/60 bg-bio-soft/50"
                  : file ? "border-bio/40 bg-bio-soft/30"
                  : "border-border hover:border-muted-foreground/40 bg-secondary/30"
              }`}
            >
              <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp,image/gif,application/pdf" onChange={(e) => ingest(e.target.files?.[0])} />
              {file && !isPdf ? (
                <img src={file.previewUrl} alt="תצוגה מקדימה" className="max-h-28 w-auto object-contain border border-border" />
              ) : (
                <div className={`w-9 h-9 border flex items-center justify-center ${file ? "border-bio/50 text-bio" : "border-border text-muted-foreground"}`}>
                  {file ? (isPdf ? <FileText className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />) : <Upload className="w-4 h-4" />}
                </div>
              )}
              <span className="text-xs font-heebo text-muted-foreground text-center break-all">
                {file ? file.name : "גררי קובץ לכאן או לחצי לבחירה — PNG, JPG, PDF"}
              </span>
              {file && <span className="inline-flex items-center gap-1 text-[10px] text-bio font-heebo tracking-wider"><FileCheck className="w-3 h-3" strokeWidth={3} /> קובץ מוכן לניתוח</span>}
            </label>
          </div>

          {/* Building type + action */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <label className="text-[10px] tracking-[0.3em] text-muted-foreground/60 font-heebo uppercase block mb-3">סוג מבנה</label>
              <select
                value={buildingType} onChange={(e) => setBuildingType(e.target.value)}
                className="w-full bg-background border border-border px-4 py-3 text-foreground font-heebo text-sm focus:outline-none focus:border-primary/40 transition-colors"
              >
                {BUILDING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <button
              onClick={generate}
              disabled={state === "analyzing"}
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-heebo font-medium px-6 py-3.5 text-sm tracking-wide hover:bg-foreground/85 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === "analyzing"
                ? (<><Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} /> מנתח את השרטוט…</>)
                : (<><Sparkles className="w-4 h-4" strokeWidth={2} /> הפק דוח A4 אמיתי</>)}
            </button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {state === "error" && error && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-2 border border-stress/40 bg-stress-soft p-4 text-sm font-heebo text-stress-foreground leading-6"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-stress" strokeWidth={2} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Done — reopen report */}
        <AnimatePresence>
          {state === "done" && report && !reportOpen && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-wrap items-center justify-between gap-3 border border-bio/40 bg-bio-soft/50 p-4"
            >
              <span className="inline-flex items-center gap-2 font-heebo text-sm text-bio-foreground">
                <FileCheck className="w-4 h-4 text-bio" strokeWidth={2} />
                הדוח הופק — ציון כולל {report.overallScore}/100 · {report.verdictLabel}
              </span>
              <button onClick={() => setReportOpen(true)} className="text-sm font-heebo text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors">
                פתח דוח A4
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {reportOpen && report && (
        <BlueprintReport
          report={report}
          imageUrl={isPdf ? null : file?.previewUrl}
          buildingType={buildingType}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}
