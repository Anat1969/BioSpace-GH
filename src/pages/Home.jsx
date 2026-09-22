import HeroSection from "../components/HeroSection";
import FeaturesGrid from "../components/FeaturesGrid";
import ScientificBanner from "../components/ScientificBanner";
import ImageBand from "../components/ImageBand";
import Footer from "../components/Footer";
import bandForest from "@/assets/band-vertical-forest.jpg";
import bandTowers from "@/assets/band-green-towers.jpg";
import bandBalcony from "@/assets/band-balcony-plants.jpg";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-heebo" dir="rtl">
      <HeroSection />
      <ImageBand
        image={bandForest}
        alt="יער אנכי — מגדל מגורים עטוף בעצים ושיחים"
        eyebrow="Living Architecture"
        caption="כשהמבנה נושם — הגוף עונה."
      />
      <FeaturesGrid />
      <ImageBand
        image={bandTowers}
        alt="מגדלים אורגניים עם מרפסות ירוקות תחת שמיים כחולים"
        eyebrow="Daylight & Green"
        caption="אור טבעי אינו מותרות. הוא תרופה."
      />
      <ScientificBanner />
      <ImageBand
        image={bandBalcony}
        alt="חזית מבנה עם מרפסות עמוסות צמחייה"
        eyebrow="The Body Reads the Walls"
        caption="כל חלל אומר משהו לגוף שלך."
        height="52vh"
      />
      <Footer />
    </main>
  );
}
