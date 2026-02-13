import { content } from "@western-mass-septic/config";
import {
  Building2,
  Hammer,
  Wrench,
  ClipboardCheck,
  Info,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  hammer: Hammer,
  wrench: Wrench,
  "clipboard-check": ClipboardCheck,
  info: Info,
  briefcase: Briefcase,
};

export default function ServicesSection() {
  const { services } = content;

  return (
    <section id="services" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Our Services</h2>
          <p className="section-subheading">
            Title-V inspections, informational evaluations, and minor repairs in the greater Springfield area.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] || Briefcase;
            return (
              <div
                key={idx}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {service.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "var(--color-primary)", opacity: 0.1 }}
                  >
                    <Icon size={24} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
