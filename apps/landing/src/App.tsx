import { company, content, type SectionKey } from "@western-mass-septic/config";
import NavigationBar from "./components/NavigationBar";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import ContactSection from "./components/ContactSection";
import GallerySection from "./components/GallerySection";
import FooterSection from "./components/FooterSection";

const style = document.documentElement.style;
style.setProperty("--color-primary", company.theme.primaryColor);
style.setProperty("--color-secondary", company.theme.secondaryColor);
style.setProperty("--color-accent", company.theme.accentColor);
style.setProperty("--color-background", company.theme.backgroundColor);
style.setProperty("--font-family", `'${company.theme.fontFamily}', system-ui, sans-serif`);
style.setProperty("--border-radius", `${company.theme.borderRadius}px`);

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
style.setProperty("--color-primary-dark", adjustColor(company.theme.primaryColor, -30));
style.setProperty("--color-primary-light", adjustColor(company.theme.primaryColor, 40));
style.setProperty("--color-secondary-dark", adjustColor(company.theme.secondaryColor, -30));

const sectionComponents: Record<SectionKey, React.FC> = {
  hero: HeroSection,
  services: ServicesSection,
  about: AboutSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  contact: ContactSection,
  gallery: GallerySection,
};

export default function App() {
  document.title = `${company.name} | ${company.tagline}`;

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <main>
        {content.sections.map((sectionKey) => {
          const SectionComponent = sectionComponents[sectionKey];
          return SectionComponent ? <SectionComponent key={sectionKey} /> : null;
        })}
      </main>
      <FooterSection />
    </div>
  );
}
