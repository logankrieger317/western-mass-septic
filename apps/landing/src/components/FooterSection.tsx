import { company, content } from "@western-mass-septic/config";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const sectionLabels: Record<string, string> = {
  services: "Services",
  about: "About",
  testimonials: "Reviews",
  faq: "FAQ",
  contact: "Contact",
  gallery: "Gallery",
};

const socialIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function FooterSection() {
  const navItems = content.sections
    .filter((s) => s !== "hero")
    .map((s) => ({ key: s, label: sectionLabels[s] || s, href: `#${s}` }));

  const socialEntries = Object.entries(company.socials).filter(
    ([, url]) => url && url.length > 0
  );

  return (
    <footer className="text-white py-16 px-4" style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">{company.name}</h3>
            <p className="text-white/70 leading-relaxed">{company.tagline}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a href={item.href} className="text-white/70 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-white/70">
              <p>{company.phone}</p>
              <p>{company.email}</p>
              <p>{company.address}</p>
            </div>

            {socialEntries.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialEntries.map(([platform, url]) => {
                  const Icon = socialIcons[platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
