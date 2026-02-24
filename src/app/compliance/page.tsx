import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { BuiltForPestControl } from "@/components/sections/BuiltForPestControl";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import {
  complianceFeatures,
  complianceSteps,
  complianceFAQ,
  complianceBeforeItems,
  complianceAfterItems,
} from "@/data/compliance-features";
import { DEMO_BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Elevate Compliance — Automated Written Instructions & Permanent Records",
  description:
    "Automated compliance documentation for pest control companies. Written Instructions and Permanent Records generated from FieldRoutes data. Audit-ready in seconds.",
  keywords: [
    "pest control compliance",
    "written instructions pest control",
    "permanent records pest control",
    "CT DEEP compliance",
    "pest control regulatory documentation",
    "fieldroutes compliance",
  ],
};

export default function CompliancePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        badge="Integrates with FieldRoutes"
        title={
          <>
            Chemical Compliance,{" "}
            <span className="gradient-text">Simplified</span>
          </>
        }
        subtitle="Automated Written Instructions and Permanent Records for pest control companies. Stop chasing paperwork. Start staying compliant."
        ctas={[
          { label: "Book a Demo", href: DEMO_BOOKING_URL },
          { label: "See Features", href: "#features", variant: "secondary" },
        ]}
        imagePlaceholder="Compliance Dashboard"
        imageType="document"
      />

      {/* How It Works */}
      <HowItWorks
        title="Three Steps to Effortless Compliance"
        subtitle="Connect your data, set up templates, and let the system handle the rest."
        steps={complianceSteps}
      />

      {/* Features */}
      <div id="features">
        <FeatureGrid
          title="Everything You Need to Stay Compliant"
          subtitle="Purpose-built tools for pest control compliance documentation."
          features={complianceFeatures}
        />
      </div>

      {/* Before/After */}
      <BeforeAfter
        beforeItems={complianceBeforeItems}
        afterItems={complianceAfterItems}
      />

      {/* Built for Pest Control */}
      <BuiltForPestControl />

      {/* FAQ */}
      <FAQ items={complianceFAQ} />

      {/* CTA */}
      <CTASection
        title="Simplify Your Compliance Workflow"
        subtitle="Book a demo and see how Elevate Compliance automates your regulatory documentation."
        ctaText="Book a Demo"
        ctaHref={DEMO_BOOKING_URL}
      />
    </>
  );
}
