// ============================================================================
// LANDING PAGE CONTENT — Western Mass Septic
// Sections array controls which sections appear and in what order.
// ============================================================================

export interface HeroContent {
  headline: string;
  subheadline: string;
  backgroundImage: string;
  ctas: { label: string; href: string; variant: "primary" | "secondary" }[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AboutContent {
  headline: string;
  body: string;
  image: string;
  stats: StatItem[];
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  role?: string;
  image?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export type SectionKey = "hero" | "services" | "about" | "testimonials" | "faq" | "contact" | "gallery";

export interface SiteContent {
  hero: HeroContent;
  services: ServiceItem[];
  about: AboutContent;
  testimonials: TestimonialItem[];
  faq: FaqItem[];
  gallery: GalleryItem[];
  sections: SectionKey[];
}

export const content: SiteContent = {
  hero: {
    headline: "Title-V Inspections & Septic Services",
    subheadline: "Serving the greater Springfield area with over a decade of experience. Minimally invasive inspections—we leave your lawn looking like we were never there.",
    backgroundImage: "/assets/hero.jpg",
    ctas: [
      { label: "Get a Free Quote", href: "tel:4134395871", variant: "primary" },
      { label: "Contact Us", href: "#contact", variant: "secondary" },
    ],
  },

  services: [
    {
      title: "Title-V Inspections",
      description: "Full Title-V (Title 5) inspections for property transfers and compliance. We connect you with a licensed inspector and handle the process professionally.",
      icon: "clipboard-check",
      image: "/assets/title5.jpg",
    },
    {
      title: "Information Inspections",
      description: "Informational septic system evaluations when you need to know the condition of your system without a full Title-V.",
      icon: "info",
      image: "/assets/info-inspection.jpg",
    },
    {
      title: "Minor Repairs",
      description: "Expert minor repairs and maintenance to keep your septic system in good working order.",
      icon: "wrench",
      image: "/assets/repairs.jpg",
    },
  ],

  about: {
    headline: "Why Choose Western Mass Septic?",
    body: "Based in Wilbraham, MA, we've been performing septic inspections and minor repairs for the greater Springfield area for over a decade. We pride ourselves on superior service and attention to detail. With our minimally invasive inspection process, we leave your lawn looking as if we weren't even there.",
    image: "/assets/about.jpg",
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "Greater Springfield", label: "Service Area" },
      { value: "Minimally Invasive", label: "Our Approach" },
    ],
  },

  testimonials: [
    {
      name: "Local Homeowner",
      text: "Western Mass Septic has been performing septic inspections and minor repairs to the greater Springfield area. With over a decade of experience they pride themselves on their ability to provide you with the best service possible.",
      rating: 5,
      role: "Wilbraham, MA",
    },
  ],

  faq: [
    {
      question: "What is a Title-V (Title 5) inspection?",
      answer: "Massachusetts law requires a Title 5 inspection when selling or transferring property with a septic system. The inspection evaluates the system's condition and compliance with state standards. We can connect you with a licensed inspector and guide you through the process.",
    },
    {
      question: "Do you offer free quotes?",
      answer: "Yes. Call or text (413) 439-5871 for a free quote. We're happy to discuss your needs and schedule an inspection or repair.",
    },
    {
      question: "What areas do you serve?",
      answer: "We serve the greater Springfield area including Wilbraham and surrounding communities in Western Massachusetts.",
    },
    {
      question: "Where can I learn more about Massachusetts Title 5 law?",
      answer: "Mass.gov has detailed information: https://www.mass.gov/info-details/massachusetts-law-about-title-5. We're happy to answer questions when you call.",
    },
  ],

  gallery: [],

  sections: ["hero", "services", "about", "testimonials", "faq", "contact"],
};
