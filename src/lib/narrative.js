// The conceptual journey. Each act is one stage in understanding the thesis
// "the body reads the walls" — from claim, through evidence and diagnosis, to
// consequence, intervention and the frontier. Section ids double as scroll
// anchors used by ProgressNav.
export const ACTS = [
  {
    id: "thesis",
    num: "01",
    kicker: "The Claim",
    title: "הטענה",
    bridge: "הגוף מגיב למרחב הבנוי — עוד לפני שאנחנו מודעים לכך.",
  },
  {
    id: "evidence",
    num: "02",
    kicker: "The Evidence",
    title: "העדות",
    bridge: "לפני הכלים — הראיות. מה מראה המחקר שנבדק על הקשר בין סביבה לפיזיולוגיה.",
  },
  {
    id: "diagnosis",
    num: "03",
    kicker: "The Diagnosis",
    title: "האבחון",
    bridge: "איך מודדים את ההשפעה של חלל עליך — כאן ועכשיו.",
  },
  {
    id: "consequence",
    num: "04",
    kicker: "The Consequence",
    title: "ההשלכה",
    bridge: "מה קורה לגוף ולמוח לאורך זמן — ולמי הנזק גדול יותר.",
  },
  {
    id: "intervention",
    num: "05",
    kicker: "The Intervention",
    title: "ההתערבות",
    bridge: "מהידע לפעולה — כלים שמתרגמים סביבה לבריאות מדידה.",
  },
  {
    id: "frontier",
    num: "06",
    kicker: "The Frontier",
    title: "הגבול הבא",
    bridge: "התקן הבא בתכנון: ביופרופיל הורמונלי לצד יעילות אנרגטית.",
  },
];

// Convenience lookup by id.
export const actById = (id) => ACTS.find((a) => a.id === id);
