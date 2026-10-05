import {
  PhoneMissed,
  CalendarCheck,
  HeartHandshake,
  Trophy,
  Sparkles,
  BellRing,
} from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Step } from "@/components/sections/HowItWorks";
import type { CaseStudyResult } from "@/components/sections/CaseStudy";

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

// What we typically find in the first weeks. Measured at one company.
export const homepageLeaks: FeatureItem[] = [
  {
    icon: CalendarCheck,
    title: "$161k a year sold, never serviced",
    description:
      "263 signed accounts whose first service was never booked, was missed, or was cancelled and never rebooked. Nobody owned the list, so nobody worked it.",
  },
  {
    icon: HeartHandshake,
    title: "1 in 5 \"active\" accounts gone quiet",
    description:
      "Subscriptions marked active with no service in 180+ days. They look like revenue in every report until someone checks the visits behind them.",
  },
  {
    icon: BellRing,
    title: "69% of customer texts never reached a person",
    description:
      "A single default setting in the CRM silently dropped every reply after a customer's first text. The software looked fine. The customers waited.",
  },
  {
    icon: PhoneMissed,
    title: "Callers who hung up on hold were never called back",
    description:
      "Callers who gave up in the phone queue never showed up as missed calls, so none of them got a callback. Some of them were ready to buy.",
  },
];

export const homepageCaseStudy: CaseStudyResult[] = [
  {
    value: "2x",
    label: "Close rate on leads who miss the first call",
    before: "9% with automated text follow-up",
    after: "18% with automatic call-back reminders added",
  },
  {
    value: "6 min",
    label: "Median time to call a new web lead",
    before: "92 minutes, and 37% not called within a day",
    after: "6 minutes, and 59% called within 15 minutes",
  },
  {
    value: "13 of 32",
    label: "Qualified missed callers became customers",
    before: "Callers who hung up on hold got no follow-up",
    after: "Every one called back, 41% signed up",
  },
  {
    value: "1 to 7",
    label: "Sales won after two or more missed calls",
    before: "1 such sale in four months",
    after: "7 such sales in two months",
  },
];

export const homepageCaseStudyFootnote =
  "Results from a multi-branch residential pest control company, comparing spring and early summer 2026 (before) with August and September 2026 (with Elevate). Leads are matched to new FieldRoutes subscriptions by phone and email within 30 days. A call counts as answered when the conversation lasted at least 20 seconds. Results vary by company.";

export const homepageOutcomes: FeatureItem[] = [
  {
    icon: PhoneMissed,
    title: "Answer every lead, fast",
    description:
      "New leads, missed calls, hang-ups on hold and urgent emails land in Slack as cards within a minute. CSRs claim them with one tap, and you see who responded and how fast.",
  },
  {
    icon: BellRing,
    title: "Follow up until they answer",
    description:
      "When a lead doesn't pick up, Elevate brings the card back on a set business-hours schedule. The fifth call happens as reliably as the first, and no CSR has to remember it.",
  },
  {
    icon: CalendarCheck,
    title: "Turn sold into serviced",
    description:
      "Every signed customer without a first service booked stays in front of your team until it is.",
  },
  {
    icon: HeartHandshake,
    title: "Keep customers longer",
    description:
      "See cancellations by office, channel and account age, and catch accounts that have quietly gone dormant before they show up as cancellations.",
  },
  {
    icon: Trophy,
    title: "Coach every rep and tech",
    description:
      "Sales calls are transcribed and graded automatically. Reps and techs get scorecards for close rate, speed to contact, NPS, 5-star reviews, efficiency and route completion.",
  },
  {
    icon: Sparkles,
    title: "Ask your business anything",
    description:
      "Ask a question in plain English and get the answer from FieldRoutes, your phones, your CRM and your ad accounts together, using your company's own definitions.",
  },
];

export const homepageSteps: Step[] = [
  {
    number: 1,
    title: "Connect your systems",
    description:
      "FieldRoutes, your phone system, CRM and ad accounts connect with read-only access. No new software for your CSRs to learn.",
  },
  {
    number: 2,
    title: "We find the leaks",
    description:
      "In the first weeks we show you the leads, accounts and revenue slipping through, with the dollar amount next to each.",
  },
  {
    number: 3,
    title: "Your team fixes them daily",
    description:
      "Each leak becomes a card in Slack for the person who can fix it, and the results show up in your dashboards.",
  },
];

export const homepageIntegrations: string[] = [
  "FieldRoutes",
  "GoHighLevel",
  "Voice For Pest",
  "Google Local Services Ads",
  "Meta Ads",
  "Slack",
  "Gmail",
  "Gusto",
  "Azuga",
  "Applause",
];

export const homepageCategories: ProductCategory[] = [
  {
    id: "products",
    category: "Products",
    description:
      "The dashboards and tools behind the results, each built on the same connected data.",
    accentColor: "blue",
    products: [
      {
        title: "Elevate Sales Performance",
        tagline: "Sales Performance",
        description:
          "Leaderboards, rep scorecards and commission tracking, so reps always know where they stand and what they've earned.",
        features: [
          "Live sales leaderboards with rankings and filters",
          "Per-rep KPI dashboards and call grades",
          "Transparent commission and backends tracking",
          "Speed-to-contact and lead follow-up reporting",
          "Role-based access for every level of your org",
        ],
        href: "/dashboards",
        accentColor: "blue",
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
        accentColor: "emerald",
      },
    ],
  },
];
