import { useState } from "react";
import { company, content } from "@western-mass-septic/config";
import { Menu, X, Phone } from "lucide-react";

const sectionLabels: Record<string, string> = {
  hero: "Home",
  services: "Services",
  about: "About",
  testimonials: "Reviews",
  faq: "FAQ",
  contact: "Contact",
  gallery: "Gallery",
};

export default function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = content.sections
    .filter((s) => s !== "hero")
    .map((s) => ({ key: s, label: sectionLabels[s] || s, href: `#${s}` }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-3">
            <img
              src={company.logo}
              alt={company.name}
              className="h-10 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xl font-bold" style={{ color: "var(--color-secondary)" }}>
              {company.name}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone.replace(/\D/g, "")}`}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Phone size={16} />
              {company.phone}
            </a>
          </div>

          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="block text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${company.phone.replace(/\D/g, "")}`}
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              {company.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
