import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: "🔬",
    title: "ביופרופיל הורמונלי",
    description: "סורק AR שמעריך אור טבעי, חומרים וצמחייה — ומתרגם את החלל שלך לפרופיל הורמונלי מדויק."
  },
  {
    icon: "🧭",
    title: "מצפן גופני",
    description: "מסתנכרן עם שעונים חכמים לניטור HRV ותגובת ציר ה-HPA בזמן אמת. הגוף שלך מדבר — עכשיו תשמע."
  },
  {
    icon: "🌿",
    title: "החלמה ב-4 דקות",
    description: "סימולטור VR מבוסס תיאוריית ההחלמה הביופילית של רוג'ר אולריך. ארבע דקות. שינוי מדיד."
  },
  {
    icon: "⚡",
    title: "אתגר השעה",
    description: "שאל את עצמך: ״מה החדר הזה אומר לגוף שלי?״ — משימות יומיות שמחדדות את המודעות הסביבתית שלך."
  }
];

export default function FeaturesGrid() {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12" dir="rtl">
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16 md:mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-[1px] bg-accent" />
          <span className="text-xs tracking-[0.2em] text-accent-foreground/60 font-heebo">
            יכולות מרכזיות
          </span>
        </div>
        <h2 className="font-frank text-3xl md:text-4xl font-bold text-foreground">
          הכלים שמחברים
          <span className="text-primary"> בין גוף למרחב</span>
        </h2>
      </div>

      {/* Asymmetric grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {FEATURES.map((feature, i) => (
          <div key={i} className={i === 0 ? "md:translate-y-8" : i === 3 ? "md:-translate-y-8" : ""}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          </div>
        ))}
      </div>
    </section>
  );
}