import {
  Trophy,
  BarChart3,
  DollarSign,
  Wrench,
  Receipt,
  Settings,
} from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Step } from "@/components/sections/HowItWorks";
import type { FAQItem } from "@/components/sections/FAQ";
import type { Stat } from "@/components/sections/SocialProof";
import type { RoleItem } from "@/components/sections/RoleBasedAccess";
import {
  User,
  HardHat,
  Building2,
  Globe,
  ShieldCheck,
} from "lucide-react";

export const dashboardsFeatures: FeatureItem[] = [
  {
    icon: Trophy,
    title: "Sales Leaderboard",
    description:
      "Real-time competitive ranking of every sales rep by total sales, serviced accounts, close rate, daily average, and contract revenue. Advanced filters for revenue mode, sold definition, role, and service type.",
  },
  {
    icon: BarChart3,
    title: "Sales Dashboard",
    description:
      "Per-rep overview showing 8 core KPIs: Sold count, Serviced count, Sold Revenue (12/13-mo), Serviced Revenue (12/13-mo), Serviced ARV, and Total ARV. Full subscription transaction log with pagination.",
  },
  {
    icon: DollarSign,
    title: "Commission & Backends",
    description:
      "Full commission breakdown with tiered payscale calculations. Active & Current Revenue, commission tiers, upfront advances, first and second backends, and recruiter override tracking — all in real time.",
  },
  {
    icon: Wrench,
    title: "Operations Dashboard",
    description:
      "Technician performance tracking with metrics for completed services (initials, quarterlies, reservices), total production revenue, 5-star review counts, and a technician leaderboard.",
  },
  {
    icon: Receipt,
    title: "Invoice Production",
    description:
      "Revenue production broken down by service type. Invoice counts, total production amounts, and percentage-of-total for each service category with summary cards for total production.",
  },
  {
    icon: Settings,
    title: "Admin & Compensation",
    description:
      "Manage payscale tiers, rep payscale assignments, upfront advance rates, and recruiter override structures. Full user management with role-based access control.",
  },
];

export const dashboardsSteps: Step[] = [
  {
    number: 1,
    title: "Connect FieldRoutes",
    description:
      "We sync your subscriptions, appointments, employees, and customers automatically. No manual imports.",
  },
  {
    number: 2,
    title: "Configure Your Team",
    description:
      "Set up roles, payscales, commission tiers, and override structures in the admin panel.",
  },
  {
    number: 3,
    title: "Watch Performance Take Off",
    description:
      "Real-time dashboards, leaderboards, and commission tracking go live instantly for your entire team.",
  },
];

export const dashboardsRoles: RoleItem[] = [
  {
    icon: User,
    role: "Sales Rep",
    description:
      "Their own dashboard, the full leaderboard with rankings visible, and their own commission and backends details.",
  },
  {
    icon: HardHat,
    role: "Technician",
    description:
      "Their own operations dashboard with completed services, production revenue, and review metrics.",
  },
  {
    icon: Building2,
    role: "Branch Manager",
    description:
      "All sales and ops data with the ability to filter by any team member in their branch.",
  },
  {
    icon: Globe,
    role: "Regional Manager",
    description:
      "Company-wide data across all locations with full visibility into every branch and team.",
  },
  {
    icon: ShieldCheck,
    role: "Admin",
    description:
      "Everything plus compensation configuration, payscale management, and full user management.",
  },
];

export const dashboardsFAQ: FAQItem[] = [
  {
    question: "What data do I need to get started?",
    answer:
      "Just your FieldRoutes account. We connect to FieldRoutes and sync all subscription, appointment, employee, and customer data automatically. No spreadsheets or manual imports needed.",
  },
  {
    question: "Can reps see each other's commission?",
    answer:
      "No. Role-based access ensures reps only see their own financial details. Leaderboard rankings are visible to everyone to motivate healthy competition, but individual commission numbers remain private.",
  },
  {
    question: "Does it handle multi-year contracts?",
    answer:
      "Yes. The leaderboard tracks multi-year subscriptions separately, and revenue calculations support both 12-month and 13-month modes so you can see the numbers the way you need them.",
  },
  {
    question: "Can I track recruiter overrides?",
    answer:
      "Absolutely. Set override rates per recruiter-recruit pair, and override earnings are calculated and displayed in real time alongside regular commission data.",
  },
  {
    question: "How quickly does data update?",
    answer:
      "Data syncs from FieldRoutes regularly throughout the day. Your leaderboards, dashboards, and commission calculations reflect the latest data without any manual refresh.",
  },
  {
    question: "What if I have multiple branches?",
    answer:
      "Elevate Sales Performance supports multi-branch operations. Regional managers see data across all locations, while branch managers are scoped to their own team.",
  },
];

export const dashboardsStats: Stat[] = [
  { value: "8", label: "Core KPIs tracked per rep" },
  { value: "5", label: "Role-based access levels" },
  { value: "Real-Time", label: "Leaderboard and commission updates" },
];
