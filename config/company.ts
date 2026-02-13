// ============================================================================
// COMPANY CONFIGURATION — Western Mass Septic
// Drives theming, CRM pipeline, and contact info across landing + CRM.
// ============================================================================

export interface PipelineStage {
  key: string;
  label: string;
  color: string;
}

export interface LeadField {
  key: string;
  label: string;
  type: "text" | "number" | "currency" | "select" | "date" | "email" | "phone" | "textarea";
  options?: string[];
  required?: boolean;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface Socials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  google?: string;
  tiktok?: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logo: string;
  favicon: string;
  socials: Socials;
  theme: Theme;
  pipeline: {
    stages: PipelineStage[];
    entityName: string;
    entityNamePlural: string;
  };
  leadFields: LeadField[];
}

export const company: CompanyConfig = {
  name: "Western Mass Septic",
  tagline: "Title-V Inspections & Septic Services",
  phone: "(413) 439-5871",
  email: "liammccool@westernmassseptic.com",
  address: "30 Brookmont Drive, Wilbraham, MA 01095",
  logo: "/assets/logo.png",
  favicon: "/assets/favicon.ico",

  socials: {
    google: "https://g.page/westernmassseptic",
  },

  theme: {
    primaryColor: "#9B804A",
    secondaryColor: "#132A1F",
    accentColor: "#F2EDE3",
    backgroundColor: "#F8F9FA",
    fontFamily: "Libre Franklin",
    borderRadius: 8,
  },

  pipeline: {
    stages: [
      { key: "lead", label: "New Lead", color: "#6B7280" },
      { key: "contacted", label: "Contacted", color: "#3B82F6" },
      { key: "scheduled", label: "Inspection Scheduled", color: "#8B5CF6" },
      { key: "completed", label: "Inspection Done", color: "#10B981" },
      { key: "followup", label: "Follow-up / Repairs", color: "#F59E0B" },
      { key: "closed", label: "Closed", color: "#64748B" },
    ],
    entityName: "Lead",
    entityNamePlural: "Leads",
  },

  leadFields: [
    { key: "inspectionType", label: "Inspection Type", type: "select", options: ["Title-V", "Information", "Other"] },
    { key: "propertyAddress", label: "Property Address", type: "text" },
    { key: "bestTimeToCall", label: "Best Time to Call", type: "select", options: ["Morning", "Afternoon", "Evening"] },
  ],
};
