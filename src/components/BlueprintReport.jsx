import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";

const BAND = {
  supportive: { color: "var(--bio)" },
  partial: { color: "var(--stress)" },
  needs_improvement: { color: "var(--stress)" },
};

const CONF = {
  high: { color: "var(--bio)", label: "ודאות גבוהה" },
  medium: { color: "var(--stress)", label: "ודאות בינונית" },
  low: { color: "var(--muted-foreground)", label: "ודאות נמוכה" },
};

const OBS_ROWS = [
  ["rooms", "חדרים/אזורים"],
  ["openings", "פתחים וחזיתות"],
  ["orientation", "סימון צפון"],
  ["scale", "קנה מידה"],
  ["core", "ליבה פנימית"],
  ["ventilation", "אוורור"],
  ["greenery", "צמחייה/חצר"],
];

const hsl = (v) => `hsl(${v})`;

export default function BlueprintReport({ report, imageUrl, buildingType, onClose }) {
  const band = BAND[report.band] || BAND.partial;
  const today = new Date().toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });
  const params = Array.isArray(report.parameters) ? report.parameters : [];
  const obs = report.observations || {};
  const model = report?._meta?.model || "";
  const conf = CONF[report.confidence] || CONF.medium;

  return createPortal(
    <div
      className="a4-report-overlay fixed inset-0 z-[100] overflow-auto bg-foreground/40 backdrop-blur-sm flex flex-col items-center py-8 px-4"
      dir="rtl"
    >
      {/* Toolbar (not printed) */}
      <div className="report-toolbar w-full max-w-[210mm] flex items-center justify-between mb-4">
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-foreground text-background font-heebo font-medium px-5 py-2.5 text-sm hover:bg-foreground/85 transition-colors">
          <Printer className="w-4 h-4" strokeWidth={2} /> הדפס / שמור כ‑PDF
        </button>
        <button onClick={onClose} className="inline-flex items-center gap-2 border border-background/40 text-background font-heebo px-4 py-2.5 text-sm hover:bg-background/10 transition-colors">
          <X className="w-4 h-4" strokeWidth={2} /> סגור
        </button>
      </div>

      {/* A4 sheet */}
      <div className="a4-sheet bg-white text-[#1c3028] shadow-2xl" style={{ fontFamily: "var(--font-heebo)" }}>
        {/* Header */}
        <header className="flex items-start justify-between border-b-2 pb-3 mb-3" style={{ borderColor: hsl("var(--bio)") }}>
          <div>
            <span className="text-[8px] tracking-[0.28em] uppercase" style={{ color: hsl("var(--bio)") }}>
              BioSpace · הערכת סינון תכנונית מבוססת-מחקר
            </span>
            <h1 className="font-frank text-2xl font-bold leading-tight mt-0.5" style={{ fontFamily: "var(--font-frank)" }}>
              מדד תכנון ביופילי וצירקדי
            </h1>
            <p className="text-[10px] text-[#5b6b62] mt-0.5">Biophilic &amp; Circadian Design Assessment (BCDA)</p>
          </div>
          <div className="text-left text-[9px] text-[#5b6b62] leading-5">
            <div>תאריך: <span className="text-[#1c3028] font-medium">{today}</span></div>
            <div>סוג מבנה: <span className="text-[#1c3028] font-medium">{buildingType || "—"}</span></div>
            <div>{conf.label}</div>
          </div>
        </header>

        {/* Body */}
        <div className="grid grid-cols-[36%_1fr] gap-4">
          {/* Left */}
          <div className="flex flex-col gap-3">
            {imageUrl && (
              <div className="border border-[#d8e0d8] p-1">
                <img src={imageUrl} alt="שרטוט שנותח" className="w-full h-auto max-h-[50mm] object-contain" />
              </div>
            )}

            {/* Score */}
            <div className="border border-[#d8e0d8] p-2.5 text-center">
              <p className="text-[8px] tracking-[0.22em] uppercase text-[#5b6b62] mb-0.5">BCDA · ציון כולל</p>
              <div className="font-frank text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-frank)", color: hsl(band.color) }}>
                {report.overallScore}<span className="text-base text-[#9aa79f]"> / 100</span>
              </div>
              <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 text-[10px] font-medium" style={{ color: hsl(band.color), border: `1px solid ${hsl(band.color)}` }}>
                {report.bandLabel}
              </div>
              <p className="text-[8px] text-[#9aa79f] mt-1.5 leading-3">ממוצע משוקלל של 7 פרמטרים תכנוניים</p>
            </div>

            {/* Observations — proof the plan was read */}
            <div className="border-r-2 pr-2.5" style={{ borderColor: hsl("var(--bio)") }}>
              <p className="text-[8px] tracking-[0.2em] uppercase text-[#5b6b62] mb-1.5">מה השרטוט מראה</p>
              <dl className="space-y-1">
                {OBS_ROWS.map(([k, label]) => (
                  <div key={k} className="text-[9.5px] leading-4">
                    <dt className="font-medium text-[#3a4a42] inline">{label}: </dt>
                    <dd className="inline text-[#5b6b62]">{obs[k] || "לא צוין בתוכנית"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right: parameters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[8px] tracking-[0.22em] uppercase text-[#5b6b62]">פרמטרי הערכה</p>
              <p className="text-[8px] text-[#9aa79f]">משקל · ציון · ודאות</p>
            </div>
            <div className="divide-y divide-[#e4ece4]">
              {params.map((p) => {
                const c = CONF[p.confidence] || CONF.low;
                return (
                  <div key={p.key} className="py-1.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10.5px] font-medium text-[#1c3028]">
                        {p.name}
                        <span className="text-[8px] text-[#9aa79f] font-normal"> · {p.weight}%</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: hsl(c.color) }} title={c.label} />
                        <span className="font-frank text-[12px] font-bold tabular-nums" style={{ fontFamily: "var(--font-frank)", color: hsl(band.color) }}>{p.score}</span>
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#e4ece4] overflow-hidden mb-1">
                      <div className="h-full" style={{ width: `${p.score}%`, background: hsl(band.color) }} />
                    </div>
                    <p className="text-[9.5px] leading-4 text-[#5b6b62]">{p.finding}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Plan summary + interpretation */}
        {report.planType && (
          <p className="text-[9px] text-[#5b6b62] italic mt-3 border-t border-[#e4ece4] pt-2">שרטוט שזוהה: {report.planType}</p>
        )}
        {report.interpretation && (
          <section className="mt-2">
            <h2 className="font-frank text-[13px] font-bold mb-1" style={{ fontFamily: "var(--font-frank)" }}>פרשנות תכנונית (זהירה)</h2>
            <p className="text-[10.5px] leading-5 text-[#3a4a42]">{report.interpretation}</p>
          </section>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <section className="mt-2">
            <h2 className="font-frank text-[13px] font-bold mb-1" style={{ fontFamily: "var(--font-frank)" }}>המלצות תכנוניות</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              {report.recommendations.map((r, i) => (
                <li key={i} className="text-[10px] leading-4 text-[#3a4a42] flex gap-1.5">
                  <span style={{ color: hsl("var(--bio)") }}>▪</span><span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Methodology + disclaimer */}
        <section className="mt-3 pt-2 border-t border-[#e4ece4]">
          <p className="text-[8.5px] leading-4 text-[#5b6b62]">
            <span className="font-medium text-[#3a4a42]">מתודולוגיה:</span> הציון הוא ממוצע משוקלל של 7 פרמטרים (משקלים מוצגים), המדורגים 0–100 על סמך מה שניתן להסיק מתוכנית בלבד.
            זהו <span className="font-medium">כלי סינון תכנוני מבוסס-מחקר</span> — <span className="font-medium">אינו מדידה פיזיולוגית/הורמונלית</span>, אינו קובע רמות קורטיזול, ואינו תחליף לחוות דעת מקצועית.
            חשיפה לאור מזוהה עם סנכרון המערכת הצירקדית, אך לא ניתן להסיק תגובה הורמונלית מתוכנית.
          </p>
          <p className="text-[8px] text-[#9aa79f] mt-1">
            מקורות: WHO Housing &amp; Health · CIE Integrative Lighting (melanopic EDI) · Ulrich (views to nature) · EN 17037 (daylight).
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-3 pt-2 border-t border-[#e4ece4] flex items-center justify-between text-[8px] text-[#9aa79f]">
          <span>הופק על ידי BioSpace · ניתוח אוטומטי ({model}).</span>
          <span>BioSpace — Biophilic &amp; Circadian Design</span>
        </footer>
      </div>
    </div>,
    document.body
  );
}
