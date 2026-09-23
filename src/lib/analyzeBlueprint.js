// Client-side Claude (vision) call that screens an uploaded architectural plan
// and returns a transparent, research-based "Biophilic & Circadian Design
// Assessment" (BCDA). This is a PLANNING screening tool — not a medical or
// physiological measurement. Scores reflect only what can be inferred from a
// 2D plan; the overall score is computed in code from fixed weights so it is
// reproducible and defensible (not a number the model "chose").
//
// Runs entirely in the browser against the Anthropic Messages API using the
// visitor's OWN API key (stored locally, never embedded in this repo).

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

// Fixed rubric. weights sum to 100. Each parameter states what is measured and,
// crucially, what can and cannot be concluded from a plan alone.
export const PARAMETERS = [
  { key: "daylight", name: "גישה לאור יום", weight: 22,
    measured: "עומק חדרים מהחזית, שטח פתחים, שיעור ליבה מוארת",
    inferable: "ניתן להעריך פוטנציאל אור יום; לא ניתן למדוד עוצמה (lux) מתוכנית",
    source: "CIE / EN 17037" },
  { key: "ventilation", name: "אוורור טבעי", weight: 18,
    measured: "פתחים בקירות מנוגדים (אוורור צולב) מול חד-כיווני",
    inferable: "ניתן להעריך מסלולי אוויר; לא ניתן למדוד איכות אוויר בפועל",
    source: "WHO Housing & Health" },
  { key: "circadian", name: "פוטנציאל צירקדי", weight: 16,
    measured: "שיעור השטח המאויש עם גישה לאור יום מול ליבה מלאכותית",
    inferable: "פוטנציאל בלבד; melanopic EDI אינו נמדד מתוכנית",
    source: "CIE Integrative Lighting" },
  { key: "views", name: "קשר חזותי לטבע", weight: 14,
    measured: "כיווני חלונות אל חוץ / חצר / צמחייה",
    inferable: "נוכחות או היעדר בלבד; איכות הנוף אינה ניתנת להערכה",
    source: "פסיכולוגיה סביבתית (Ulrich)" },
  { key: "greenery", name: "צמחייה וחצרות", weight: 12,
    measured: "חצרות פנימיות, אטריום, סימוני נטיעה",
    inferable: "אם לא סומן בתוכנית — לא ניתן להסיק",
    source: "עקרונות עיצוב ביופילי" },
  { key: "spatial", name: "ארגון מרחבי (עיקרון תכנוני)", weight: 10,
    measured: "הפרדת יום/לילה, בהירות תנועה, פרוספקט-מחסה",
    inferable: "עיקרון תכנוני איכותני; אינו מדד פיזיולוגי מוכח",
    source: "תיאוריה סביבתית (לא כמותי)" },
  { key: "orientation", name: "אוריינטציה סולרית", weight: 8,
    measured: "סימון צפון וכיווני החזיתות העיקריות",
    inferable: "ללא סימון צפון — ההערכה בעלת ודאות נמוכה",
    source: "עקרונות תכנון פסיבי" },
];

export const MODELS = [
  { id: "claude-opus-5", label: "Opus 5 — איכות מרבית" },
  { id: "claude-sonnet-5", label: "Sonnet 5 — מהיר וחסכוני" },
];

const paramSpec = PARAMETERS.map(
  (p) => `  - "${p.key}" (${p.name}, משקל ${p.weight}%): נמדד — ${p.measured}. ניתן להסיק — ${p.inferable}.`
).join("\n");

function systemPrompt() {
  return `אתה יועץ תכנון סביבתי שמבצע הערכת סינון של תוכנית אדריכלית לפי מתודולוגיית BioSpace: "מדד תכנון ביופילי וצירקדי" (Biophilic & Circadian Design Assessment). זהו כלי סינון תכנוני מבוסס-מחקר — לא מדידה רפואית או פיזיולוגית.

חוקי אמינות מחייבים:
1. נתח אך ורק את מה שנראה בתוכנית. הוכח שקראת אותה: מלא סעיף observations עם ממצאים קונקרטיים (חדרים שזוהו, פתחים ומיקומם, סימון צפון, קנה מידה, מצב הליבה, סוג אוורור, צמחייה). אם פרט אינו מסומן/לא קריא — כתוב זאת מפורשות.
2. שפה מדעית זהירה. אסור לקבוע רמות קורטיזול, "איזון הורמונלי" או תגובה פיזיולוגית מתוך תוכנית. השתמש ב"משפיע על"/"מזוהה עם"/"פוטנציאל", והבהר שלא ניתן להסיק ערכים הורמונליים מתוכנית בלבד.
3. פרוספקט-מחסה הוא עיקרון תכנוני איכותני, לא מדד פיזיולוגי — התייחס אליו ככזה.
4. תן ציון 0-100 לכל אחד מ-7 הפרמטרים, לפי מה שניתן להסיק מהתוכנית, עם רמת ודאות (high/medium/low) וממצא ספציפי המנמק את הציון מתוך השרטוט הזה. אל תנפח ציונים.

החזר אך ורק אובייקט JSON תקין (בלי טקסט/markdown/תגיות מסביב) במבנה:

{
  "planType": "סוג התוכנית (למשל: תוכנית קומה למגורים).",
  "readability": "high" | "medium" | "low",
  "observations": {
    "rooms": "חדרים/אזורים עיקריים שזוהו.",
    "openings": "פתחים/חלונות שזוהו והחזיתות שבהן.",
    "orientation": "האם קיים סימון צפון (אם לא — ציין).",
    "scale": "האם קיים קנה מידה/מידות (אם לא — ציין).",
    "core": "מצב הליבה הפנימית — מוארת או תלויה בתאורה מלאכותית.",
    "ventilation": "cross | single-sided | unclear — עם נימוק קצר.",
    "greenery": "האם סומנה צמחייה/חצר/אטריום (אם לא — ציין)."
  },
  "parameters": [
    { "key": "<אחד מהמפתחות למטה>", "score": <0-100>, "confidence": "high"|"medium"|"low", "finding": "ממצא קצר (עד ~16 מילים) המעוגן בשרטוט." }
  ],
  "interpretation": "פסקה זהירה אחת (3-4 משפטים): מה עולה מהתוכנית והשלכותיו התכנוניות, עם סייג שלא ניתן להסיק רמות הורמונליות מתוכנית.",
  "recommendations": ["המלצה מעשית 1", "המלצה 2", "המלצה 3"],
  "confidence": "high" | "medium" | "low"
}

מערך parameters חייב לכלול בדיוק את 7 המפתחות הבאים, בסדר זה:
${paramSpec}

כל שדות הטקסט בעברית ותמציתיים — הדוח נועד לעמוד A4 יחיד. אל תחשב ציון כולל; הוא יחושב בקוד מהמשקלים.`;
}

function userPrompt(buildingType) {
  return `סוג המבנה שהוגדר: ${buildingType || "לא צוין"}.
נתח את השרטוט המצורף והחזר את דוח ה-JSON לפי המבנה. אם אינו תוכנית אדריכלית קריאה — ציין זאת ב-planType/observations, קבע readability="low" והחזר ציונים נמוכים עם confidence="low".`;
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) throw new Error("המודל לא החזיר JSON תקין. נסי שוב.");
  let parsed;
  try { parsed = JSON.parse(text.slice(start, end + 1)); }
  catch { throw new Error("שגיאה בפענוח תשובת המודל (JSON לא תקין). נסי שוב."); }
  if (!parsed || !Array.isArray(parsed.parameters)) throw new Error("תשובת המודל חסרה שדות נדרשים. נסי שוב.");
  return parsed;
}

// Compute the overall BCDA score from fixed weights (reproducible & explainable).
function computeScore(parameters) {
  const byKey = Object.fromEntries((parameters || []).map((p) => [p.key, p]));
  let sum = 0, wsum = 0;
  const enriched = PARAMETERS.map((def) => {
    const got = byKey[def.key] || {};
    const score = Math.max(0, Math.min(100, Number(got.score) ?? 50));
    sum += score * def.weight;
    wsum += def.weight;
    return {
      key: def.key, name: def.name, weight: def.weight,
      score, confidence: got.confidence || "low",
      finding: got.finding || "לא זוהה מידע מספיק בתוכנית.",
      inferable: def.inferable, source: def.source,
    };
  });
  const overall = Math.round(sum / (wsum || 100));
  const band = overall >= 72 ? "supportive" : overall >= 55 ? "partial" : "needs_improvement";
  const bandLabel = band === "supportive" ? "תכנון תומך" : band === "partial" ? "תומך חלקית" : "דורש שיפור";
  return { overall, band, bandLabel, enriched };
}

function friendlyError(status, bodyText) {
  let msg = bodyText;
  try { msg = JSON.parse(bodyText)?.error?.message || bodyText; } catch { /* keep raw */ }
  if (status === 401) return "מפתח API לא תקין. בדקי את המפתח ונסי שוב.";
  if (status === 400 && /credit|billing|balance/i.test(msg)) return "אין יתרת שימוש בחשבון ה-API. הוסיפי קרדיט ב-console.anthropic.com.";
  if (status === 429) return "חריגה ממגבלת קצב. המתיני רגע ונסי שוב.";
  if (status === 529) return "שירות ה-API עמוס כרגע. נסי שוב בעוד רגע.";
  return `שגיאת API (${status}): ${msg}`;
}

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
    messages: [{ role: "user", content: [fileBlock, { type: "text", text: userPrompt(buildingType) }] }],
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
  if (data.stop_reason === "refusal") throw new Error("הבקשה נדחתה על ידי מסנני הבטיחות של המודל.");
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();

  const raw = extractJson(text);
  const { overall, band, bandLabel, enriched } = computeScore(raw.parameters);

  return {
    planType: raw.planType || "",
    readability: raw.readability || "medium",
    observations: raw.observations || {},
    parameters: enriched,
    overallScore: overall,
    band, bandLabel,
    interpretation: raw.interpretation || "",
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
    confidence: raw.confidence || "medium",
    _meta: { model, usage: data.usage || null },
  };
}
