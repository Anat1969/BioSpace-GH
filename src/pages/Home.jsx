import HeroSection from "../components/HeroSection";
import FeaturesGrid from "../components/FeaturesGrid";
import ScientificBanner from "../components/ScientificBanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-heebo" dir="rtl">
      <HeroSection />
      <FeaturesGrid />
      <ScientificBanner />
      <Footer />
    </main>
  );
}