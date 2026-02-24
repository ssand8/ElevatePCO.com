import { Zap, Bug, BarChart3 } from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Stat } from "@/components/sections/SocialProof";

export const homepageProducts = [
  {
    title: "Elevate Performance Dashboards",
    tagline: "Performance",
    description:
      "Real-time sales leaderboards, KPI dashboards, and commission tracking purpose-built for pest control companies.",
    features: [
      "Live sales leaderboards with rankings and filters",
      "Per-rep KPI dashboards with 8 core metrics",
      "Transparent commission and backends tracking",
      "Technician operations dashboard and production metrics",
      "Role-based access for every level of your org",
    ],
    href: "/dashboards",
    accentColor: "blue" as const,
  },
  {
    title: "Elevate Compliance",
    tagline: "Compliance",
    description:
      "Automated Written Instructions and Permanent Records for pest control regulatory compliance. Never scramble for an audit again.",
    features: [
      "Auto-generated Written Instructions from reusable templates",
      "Side-by-side prescribed vs. actual Permanent Records",
      "Instant appointment lookup for audits",
      "Smart template system with chemical auto-fill",
      "Multi-location and branch management",
    ],
    href: "/compliance",
    accentColor: "emerald" as const,
  },
];

export const homepageValueProps: FeatureItem[] = [
  {
    icon: Zap,
    title: "FieldRoutes Integration",
    description:
      "Your operational data already lives in FieldRoutes. We pull appointments, employees, chemicals, and more — automatically. Zero double data entry.",
  },
  {
    icon: Bug,
    title: "Built for Pest Control",
    description:
      "Not a generic SaaS tool. We understand the sold-to-serviced pipeline, chemical compliance, technician operations, and the metrics that matter in pest control.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Visibility",
    description:
      "Stop waiting until month-end. See sales performance, compliance status, and operational metrics as they happen — from the field to the front office.",
  },
];

export const homepageStats: Stat[] = [
  { value: "100%", label: "FieldRoutes data synced automatically" },
  { value: "5+", label: "Spreadsheets replaced per company" },
  { value: "Seconds", label: "To pull any compliance record" },
];
