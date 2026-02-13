import { content } from "@western-mass-septic/config";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = content;

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">What Our Clients Say</h2>
          <p className="section-subheading">Don&apos;t just take our word for it</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <Quote
                size={32}
                className="mb-4 opacity-20"
                style={{ color: "var(--color-primary)" }}
              />

              <p className="text-gray-600 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
