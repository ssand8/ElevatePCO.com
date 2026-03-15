import { Zap, Bug, BarChart3 } from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Stat } from "@/components/sections/SocialProof";

export interface ProductData {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  accentColor: "blue" | "emerald" | "amber";
  comingSoon?: boolean;
}

export interface ProductCategory {
  id: string;
  category: string;
  description: string;
  accentColor: "blue" | "emerald" | "amber";
  products: ProductData[];
}

export const homepageCategories: ProductCategory[] = [
  {
    id: "door-to-door",
    category: "Door to Door",
    description:
      "Equip your sales team with the tools to sell more, stay compliant in the field, and track every win.",
    accentColor: "blue",
    products: [
      {
        title: "Elevate Permits",
        tagline: "Permits",
        description:
          "Streamline permit management for door-to-door sales teams. Track permits across jurisdictions, get expiration alerts, and ensure your reps are always cleared to knock.",
        features: [
          "Permit tracking and management by jurisdiction",
          "Expiration alerts and renewal reminders",
          "Territory compliance verification",
          "Team-wide permit status dashboards",
          "Multi-jurisdiction support",
        ],
        href: "/#permits",
        accentColor: "blue",
        comingSoon: true,
      },
      {
        title: "Elevate Sales Performance",
        tagline: "Sales Performance",
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
        accentColor: "blue",
      },
    ],
  },
  {
    id: "operations",
    category: "Operations",
    description:
      "Keep your operations compliant and running at peak efficiency — from chemical paperwork to route optimization.",
    accentColor: "emerald",
    products: [
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
        accentColor: "emerald",
      },
      {
        title: "Elevate Operations Efficiency",
        tagline: "Operations Efficiency",
        description:
          "Optimize route density, technician utilization, and service delivery metrics. Identify bottlenecks and maximize your team's capacity.",
        features: [
          "Route density and optimization insights",
          "Technician utilization tracking",
          "Service delivery performance metrics",
          "Capacity planning and forecasting tools",
          "Operational bottleneck identification",
        ],
        href: "/#operations-efficiency",
        accentColor: "emerald",
        comingSoon: true,
      },
    ],
  },
  {
    id: "business-finance",
    category: "Business Finance",
    description:
      "See the financial health of your pest control business in real time — revenue, costs, and profitability at a glance.",
    accentColor: "amber",
    products: [
      {
        title: "Elevate Business Finance",
        tagline: "Business Finance",
        description:
          "Financial dashboards and reporting built for pest control P&L visibility. Track revenue, analyze costs, and monitor profitability across branches and service lines.",
        features: [
          "Revenue tracking and forecasting",
          "Cost analysis by branch and service line",
          "Profitability dashboards and P&L visibility",
          "Cash flow monitoring and alerts",
          "Financial KPI scorecards",
        ],
        href: "/#business-finance",
        accentColor: "amber",
        comingSoon: true,
      },
    ],
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
  { value: "5", label: "Products built for pest control" },
  { value: "100%", label: "FieldRoutes data synced automatically" },
  { value: "Seconds", label: "To pull any record or metric" },
];
