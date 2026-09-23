// Client-side Claude (vision) call that analyzes an uploaded architectural
// blueprint and returns a structured "architectural endocrinology" report.
//
// Runs entirely in the browser against the Anthropic Messages API using the
// visitor's OWN API key (stored locally, never embedded in this repo). This
// keeps the app fully static and independent of any backend.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// The fixed assessment parameters — a credible biophilic / environmental-
// endocrine rubric. The model scores each one from what the plan reveals.
export const PARAMETERS = [
  { key: "daylight",    name: "אור טבעי וחשיפה לאור יום" },
  { key: "views",       name: "קשר חזותי לטבע ולנוף" },
  { key: "ventilation", name: "אוורור טבעי ואיכות אוויר" },
  { key: "greenery",    name: "צמחייה ואלמנטים ביופיליים" },
  { key: "materials",   name: "חומרים טבעיים ומרקמים" },
  { key: "spatial",     name: "ארגון מרחבי — פרוספקט ומחסה" },
  { key: "circadian",   name: "מקצב יממה ותאורה" },
  { key: "acoustics",   name: "אקוסטיקה ושקט" },
];

export const MODELS = [
  { id: "claude-opus-5", label: "Opus 5 — איכות מרבית" },
  { id: "claude-sonnet-5", label: "Sonnet 5 — מהיר וחסכוני" },
];

const paramList = PARAMETERS.map((p) => `  - "${p.key}": ${p.name}`).join("\n");

function systemPrompt() {
  return `אתה בודק מוסמך ל"אנדוקרינולוגיה אדריכלית" (Architectural Endocrinology) — תחום המעריך כיצד סביבה בנויה משפיעה על מערכת העצבים, ציר ה-HPA, רמות הקורטיזול והמקצב הcircadian של המשתמשים בה.

קיבלת שרטוט/תוכנית אדריכלית של מבנה. נתח אותה בקפדנות ובכנות, אך ורק על סמך מה שנראה בשרטוט (פתחים, חלונות, עומק חדרים, אוריינטציה אם מסומנת, חצרות, פטיו, סימוני צמחייה, יחסי מסה-חלל, מסדרונות). כאשר מידע חסר בשרטוט — ציין זאת במפורש והורד ודאות, אל תמציא נתונים.

החזר אך ורק אובייקט JSON תקין (בלי טקסט לפני/אחרי, בלי גדרות markdown, בלי תגיות XML) במבנה המדויק הבא:

{
  "planSummary": "משפט-שניים בעברית שמתארים מה מראה השרטוט (סוג, חדרים עיקריים, פתחים, אוריינטציה).",
  "overallScore": <מספר שלם 0-100>,
  "verdict": "certified" | "conditional" | "not_certified",
  "verdictLabel": "עומד בתקן" | "עומד בתנאים" | "לא עומד בתקן",
  "hpaImpact": "משפט קצר על ההשפעה הצפויה על ציר ה-HPA/קורטיזול (מיטיב/ניטרלי/מלחיץ ולמה).",
  "parameters": [
    { "key": "<אחד המפתחות למטה>", "score": <0-100>, "impact": "positive" | "neutral" | "negative", "finding": "ממצא קצר (עד ~18 מילים) המנמק את הציון על סמך השרטוט." }
  ],
  "interpretation": "פסקה אחת מרוכזת (3-5 משפטים) המפרשת את ההשפעה הפיזיולוגית הכוללת של השרטוט.",
  "recommendations": ["המלצה 1", "המלצה 2", "המלצה 3"],
  "confidence": "high" | "medium" | "low"
}

כללי מפתח:
- מערך "parameters" חייב לכלול בדיוק את 8 המפתחות הבאים, בסדר הזה:
${paramList}
- כל שדות הטקסט בעברית, תמציתיים — הדוח כולו נועד להתאים לעמוד A4 יחיד.
- "overallScore" הוא הממוצע המשוקלל של הפרמטרים, מעוגל.
- verdict: certified אם overallScore ≥ 75, conditional אם 50-74, אחרת not_certified.
- 2-4 המלצות ממוקדות ומעשיות בלבד.
- היה מדויק וביקורתי; אל תנפח ציונים.`;
}

function userPrompt(buildingType) {
  return `סוג המבנה שהוגדר על ידי המשתמש: ${buildingType || "לא צוין"}.
נתח את השרטוט המצורף והפק את דוח ה-JSON לפי המבנה שהוגדר. אם השרטוט אינו קריא או אינו תוכנית אדריכלית, ציין זאת ב-planSummary והחזר ציונים נמוכים עם confidence="low".`;
}

// Pull the first balanced JSON object out of a text response.
function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("המודל לא החזיר JSON תקין. נסי שוב.");
  }
  const slice = text.slice(start, end + 1);
  let parsed;
  try {
    parsed = JSON.parse(slice);
  } catch {
    throw new Error("שגיאה בפענוח תשובת המודל (JSON לא תקין). נסי שוב.");
  }
  if (!parsed || !Array.isArray(parsed.parameters)) {
    throw new Error("תשובת המודל חסרה שדות נדרשים. נסי שוב.");
  }
  return parsed;
}

function friendlyError(status, bodyText) {
  let msg = bodyText;
  try {
    const j = JSON.parse(bodyText);
    msg = j?.error?.message || bodyText;
  } catch {
    /* keep raw text */
  }
  if (status === 401) return "מפתח API לא תקין. בדקי את המפתח ונסי שוב.";
  if (status === 400 && /credit|billing|balance/i.test(msg)) return "אין יתרת שימוש בחשבון ה-API. הוסיפי קרדיט ב-console.anthropic.com.";
  if (status === 429) return "חריגה ממגבלת קצב. המתיני רגע ונסי שוב.";
  if (status === 529) return "שירות ה-API עמוס כרגע. נסי שוב בעוד רגע.";
  return `שגיאת API (${status}): ${msg}`;
}

/**
 * @param {object} o
 * @param {string} o.apiKey
 * @param {string} o.model
 * @param {string} o.base64      base64 data WITHOUT the data: prefix
 * @param {string} o.mediaType   e.g. "image/png" or "application/pdf"
 * @param {string} o.buildingType
 * @param {AbortSignal} [o.signal]
 */
export async function analyzeBlueprint({ apiKey, model, base64, mediaType, buildingType, signal }) {
  const isPdf = mediaType === "application/pdf";
  const fileBlock = isPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }
    : { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } };

  const body = {
    model,
    max_tokens: 12000,
    output_config: { effort: "medium" },
    system: systemPrompt(),
    messages: [
      { role: "user", content: [fileBlock, { type: "text", text: userPrompt(buildingType) }] },
    ],
  };

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(friendlyError(res.status, t));
  }

  const data = await res.json();
  if (data.stop_reason === "refusal") {
    throw new Error("הבקשה נדחתה על ידי מסנני הבטיחות של המודל.");
  }
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const report = extractJson(text);
  report._meta = { model, usage: data.usage || null };
  return report;
}
