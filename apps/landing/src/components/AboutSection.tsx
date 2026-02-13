import { content } from "@western-mass-septic/config";

export default function AboutSection() {
  const { about } = content;

  return (
    <section id="about" className="py-20 px-4" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-2xl"
              style={{ backgroundColor: "var(--color-primary)", opacity: 0.1 }}
            />
            <div className="relative z-10 rounded-2xl w-full h-[400px] overflow-hidden bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center">
              <img
                src={about.image}
                alt={about.headline}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-white text-6xl font-bold opacity-30 relative z-0">
                {about.headline.charAt(0)}
              </span>
            </div>
          </div>

          <div>
            <h2 className="section-heading mb-6">{about.headline}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">{about.body}</p>

            <div className="grid grid-cols-2 gap-6">
              {about.stats.map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-white rounded-xl shadow-sm">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
