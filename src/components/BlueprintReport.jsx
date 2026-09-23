import { Printer, X, CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { PARAMETERS } from "../lib/analyzeBlueprint";

const nameByKey = Object.fromEntries(PARAMETERS.map((p) => [p.key, p.name]));

const VERDICT = {
  certified: { label: "עומד בתקן", color: "var(--bio)", Icon: CheckCircle2 },
  conditional: { label: "עומד בתנאים", color: "var(--stress)", Icon: AlertTriangle },
  not_certified: { label: "לא עומד בתקן", color: "var(--stress)", Icon: AlertTriangle },
};

const IMPACT = {
  positive: { color: "var(--bio)", Icon: CheckCircle2 },
  neutral: { color: "var(--muted-foreground)", Icon: MinusCircle },
  negative: { color: "var(--stress)", Icon: AlertTriangle },
};

const CONFIDENCE = { high: "ודאות גבוהה", medium: "ודאות בינונית", low: "ודאות נמוכה" };

function hsl(v) {
  return `hsl(${v})`;
}

export default function BlueprintReport({ report, imageUrl, buildingType, onClose }) {
  const verdict = VERDICT[report.verdict] || VERDICT.conditional;
  const today = new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });
  const params = Array.isArray(report.parameters) ? report.parameters : [];
  const model = report?._meta?.model || "";

  return (
    <div
      className="a4-report-overlay fixed inset-0 z-[100] overflow-auto bg-foreground/40 backdrop-blur-sm flex flex-col items-center py-8 px-4"
      dir="rtl"
    >
      {/* Toolbar (not printed) */}
      <div className="report-toolbar w-full max-w-[210mm] flex items-center justify-between mb-4">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-foreground text-background font-heebo font-medium px-5 py-2.5 text-sm hover:bg-foreground/85 transition-colors"
        >
          <Printer className="w-4 h-4" strokeWidth={2} /> הדפס / שמור כ‑PDF
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 border border-background/40 text-background font-heebo px-4 py-2.5 text-sm hover:bg-background/10 transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2} /> סגור
        </button>
      </div>

      {/* A4 sheet */}
      <div className="a4-sheet bg-white text-[#1c3028] shadow-2xl" style={{ fontFamily: "var(--font-heebo)" }}>
        {/* Header */}
        <header className="flex items-start justify-between border-b-2 pb-4 mb-4" style={{ borderColor: hsl("var(--bio)") }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: hsl("var(--bio)") }}>
                Architectural Endocrinology Standard
              </span>
            </div>
            <h1 className="font-frank text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-frank)" }}>
              תעודת ביופרופיל הורמונלי
            </h1>
            <p className="text-[11px] text-[#5b6b62] mt-0.5">ניתוח שרטוט אדריכלי · BioSpace</p>
          </div>
          <div className="text-left text-[10px] text-[#5b6b62] leading-5">
            <div>תאריך: <span className="text-[#1c3028] font-medium">{today}</span></div>
            <div>סוג מבנה: <span className="text-[#1c3028] font-medium">{buildingType || "—"}</span></div>
            <div>{CONFIDENCE[report.confidence] || ""}</div>
          </div>
        </header>

        {/* Body: two columns */}
        <div className="grid grid-cols-[34%_1fr] gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            {imageUrl && (
              <div className="border border-[#d8e0d8] p-1">
                <img src={imageUrl} alt="שרטוט שנותח" className="w-full h-auto max-h-[62mm] object-contain" />
              </div>
            )}

            {/* Overall score + verdict */}
            <div className="border border-[#d8e0d8] p-3 text-center">
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#5b6b62] mb-1">Endocrine Balance</p>
              <div className="font-frank text-5xl font-bold leading-none" style={{ fontFamily: "var(--font-frank)", color: hsl("var(--bio)") }}>
                {report.overallScore}
                <span className="text-lg text-[#9aa79f]"> / 100</span>
              </div>
              <div
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 text-[11px] font-medium"
                style={{ color: hsl(verdict.color), border: `1px solid ${hsl(verdict.color)}` }}
              >
                <verdict.Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {report.verdictLabel || verdict.label}
              </div>
            </div>

            {/* HPA impact */}
            {report.hpaImpact && (
              <div className="border-r-2 pr-3 text-[11px] leading-6 text-[#3a4a42]" style={{ borderColor: hsl("var(--bio)") }}>
                <span className="block text-[9px] tracking-[0.2em] uppercase text-[#5b6b62] mb-1">HPA / Cortisol</span>
                {report.hpaImpact}
              </div>
            )}
          </div>

          {/* Right column: parameters */}
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#5b6b62] mb-2">פרמטרי בדיקה</p>
            <div className="divide-y divide-[#e4ece4]">
              {params.map((p) => {
                const imp = IMPACT[p.impact] || IMPACT.neutral;
                return (
                  <div key={p.key} className="py-1.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-medium flex items-center gap-1.5">
                        <imp.Icon className="w-3 h-3" strokeWidth={2} style={{ color: hsl(imp.color) }} />
                        {nameByKey[p.key] || p.key}
                      </span>
                      <span className="font-frank text-[12px] font-bold tabular-nums" style={{ fontFamily: "var(--font-frank)", color: hsl(imp.color) }}>
                        {p.score}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#e4ece4] overflow-hidden mb-1">
                      <div className="h-full" style={{ width: `${Math.max(0, Math.min(100, p.score))}%`, background: hsl(imp.color) }} />
                    </div>
                    <p className="text-[10px] leading-4 text-[#5b6b62]">{p.finding}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plan summary */}
        {report.planSummary && (
          <p className="text-[10px] text-[#5b6b62] italic mt-4 border-t border-[#e4ece4] pt-3">
            תיאור השרטוט: {report.planSummary}
          </p>
        )}

        {/* Interpretation */}
        {report.interpretation && (
          <section className="mt-3">
            <h2 className="font-frank text-sm font-bold mb-1" style={{ fontFamily: "var(--font-frank)" }}>פרשנות פיזיולוגית</h2>
            <p className="text-[11px] leading-6 text-[#3a4a42]">{report.interpretation}</p>
          </section>
        )}

        {/* Recommendations */}
        {Array.isArray(report.recommendations) && report.recommendations.length > 0 && (
          <section className="mt-3">
            <h2 className="font-frank text-sm font-bold mb-1" style={{ fontFamily: "var(--font-frank)" }}>המלצות</h2>
            <ul className="space-y-1">
              {report.recommendations.map((r, i) => (
                <li key={i} className="text-[11px] leading-5 text-[#3a4a42] flex gap-2">
                  <span style={{ color: hsl("var(--bio)") }}>▪</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-5 pt-3 border-t border-[#e4ece4] flex items-center justify-between text-[8px] text-[#9aa79f]">
          <span>הופק על ידי BioSpace · ניתוח אוטומטי ({model}). אינו תחליף לחוות דעת מקצועית.</span>
          <span>BioSpace — Architectural Endocrinology</span>
        </footer>
      </div>
    </div>
  );
}
