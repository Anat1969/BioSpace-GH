import { Zap } from "lucide-react";
import HeroSection from "../components/HeroSection";
import {
  ScannerCard,
  CompassCard,
  TimerCard,
  ROICard,
  DemographicCard,
  BrainTimelineCard,
  BlueprintCard,
} from "../components/FeaturesGrid";
import FeatureCard from "../components/FeatureCard";
import FindingsList from "../components/FindingsList";
import StorySection, { ModuleGrid, ModuleCell } from "../components/StorySection";
import ProgressNav from "../components/ProgressNav";
import ImageBand from "../components/ImageBand";
import Footer from "../components/Footer";
import { ACTS, actById } from "../lib/narrative";
import bandForest from "@/assets/band-vertical-forest.jpg";
import bandTowers from "@/assets/band-green-towers.jpg";
import bandBalcony from "@/assets/band-balcony-plants.jpg";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-heebo" dir="rtl">
      <ProgressNav acts={ACTS} />

      {/* 01 · הטענה — the claim */}
      <HeroSection />

      <ImageBand
        image={bandForest}
        alt="יער אנכי — מגדל מגורים עטוף בעצים ושיחים"
        eyebrow="Living Architecture"
        caption="כשהמבנה נושם — הגוף עונה."
      />

      {/* 02 · העדות — the evidence */}
      <StorySection act={actById("evidence")} mesh>
        <FindingsList />
      </StorySection>

      <ImageBand
        image={bandTowers}
        alt="מגדלים אורגניים עם מרפסות ירוקות תחת שמיים כחולים"
        eyebrow="Daylight & Green"
        caption="אור טבעי אינו מותרות. הוא תרופה."
      />

      {/* 03 · האבחון — the diagnosis */}
      <StorySection act={actById("diagnosis")}>
        <ModuleGrid>
          <ModuleCell><ScannerCard /></ModuleCell>
          <ModuleCell><CompassCard /></ModuleCell>
        </ModuleGrid>
      </StorySection>

      {/* 04 · ההשלכה — the consequence */}
      <StorySection act={actById("consequence")}>
        <ModuleGrid>
          <ModuleCell full><BrainTimelineCard /></ModuleCell>
          <ModuleCell full><DemographicCard /></ModuleCell>
        </ModuleGrid>
      </StorySection>

      <ImageBand
        image={bandBalcony}
        alt="חזית מבנה עם מרפסות עמוסות צמחייה"
        eyebrow="The Body Reads the Walls"
        caption="כל חלל אומר משהו לגוף שלך."
        height="52vh"
      />

      {/* 05 · ההתערבות — the intervention */}
      <StorySection act={actById("intervention")}>
        <ModuleGrid cols="md:grid-cols-3">
          <ModuleCell><TimerCard /></ModuleCell>
          <ModuleCell><ROICard /></ModuleCell>
          <ModuleCell>
            <FeatureCard
              icon={Zap}
              title="אתגר השעה"
              description='שאל את עצמך: ״מה החדר הזה אומר לגוף שלי?״ — משימות יומיות שמחדדות את המודעות הסביבתית שלך.'
              index={2}
            />
          </ModuleCell>
        </ModuleGrid>
      </StorySection>

      {/* 06 · הגבול הבא — the frontier */}
      <StorySection act={actById("frontier")}>
        <ModuleGrid>
          <ModuleCell full><BlueprintCard /></ModuleCell>
        </ModuleGrid>
      </StorySection>

      <Footer />
    </main>
  );
}
