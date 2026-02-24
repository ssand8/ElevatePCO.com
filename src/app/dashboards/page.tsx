import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { RoleBasedAccess } from "@/components/sections/RoleBasedAccess";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SocialProof } from "@/components/sections/SocialProof";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import {
  dashboardsFeatures,
  dashboardsSteps,
  dashboardsRoles,
  dashboardsFAQ,
  dashboardsStats,
} from "@/data/dashboards-features";
import { DEMO_BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Elevate Performance Dashboards — Real-Time KPI Tracking for Pest Control",
  description:
    "Real-time sales leaderboards, KPI dashboards, and commission tracking built for pest control companies. Integrates with FieldRoutes. See every rep, every metric, every day.",
  keywords: [
    "pest control dashboard",
    "sales leaderboard pest control",
    "pest control commission tracking",
    "field service performance management",
    "pest control KPIs",
    "technician productivity tracking",
  ],
};

export default function DashboardsPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        badge="Integrates with FieldRoutes"
        title={
          <>
            Real-Time Visibility Into{" "}
            <span className="gradient-text">Every Metric That Matters</span>
          </>
        }
        subtitle="Sales leaderboards, KPI dashboards, and commission tracking purpose-built for pest control. Replace guesswork with live data for every role in your company."
        ctas={[
          { label: "Book a Demo", href: DEMO_BOOKING_URL },
          { label: "See Features", href: "#features", variant: "secondary" },
        ]}
        imagePlaceholder="Sales Leaderboard Dashboard"
        imageType="dashboard"
      />

      {/* Features */}
      <div id="features">
        <FeatureGrid
          title="Everything Your Team Needs to Win"
          subtitle="Six powerful dashboards covering sales, operations, and compensation."
          features={dashboardsFeatures}
        />
      </div>

      {/* Role-Based Access */}
      <RoleBasedAccess roles={dashboardsRoles} />

      {/* How It Works */}
      <HowItWorks
        title="Up and Running in Days, Not Months"
        subtitle="Three steps to real-time performance visibility."
        steps={dashboardsSteps}
      />

      {/* Social Proof */}
      <SocialProof stats={dashboardsStats} />

      {/* FAQ */}
      <FAQ items={dashboardsFAQ} />

      {/* CTA */}
      <CTASection
        title="See Your Data Come Alive"
        subtitle="Book a demo and experience the performance engine built for pest control dominance."
        ctaText="Book a Demo"
        ctaHref={DEMO_BOOKING_URL}
      />
    </>
  );
}
