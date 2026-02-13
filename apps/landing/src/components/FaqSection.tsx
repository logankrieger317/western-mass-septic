import { useState } from "react";
import { content } from "@western-mass-septic/config";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faq.length === 0) return null;

  return (
    <section id="faq" className="py-20 px-4" style={{ backgroundColor: "var(--color-background)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subheading">Find answers to common questions</p>
        </div>

        <div className="space-y-4">
          {faq.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
