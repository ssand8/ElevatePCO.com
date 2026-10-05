import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SocialProof } from "@/components/sections/SocialProof";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";
import {
  askFeatures,
  askSteps,
  askFAQ,
  askStats,
} from "@/data/ask-features";
import { DEMO_BOOKING_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ask Your Data — Plain-English Analytics for Pest Control",
  description:
    "Ask your pest control data anything in plain English and get the answer in seconds. No SQL, no spreadsheets. Multi-turn conversations, streaming answers, and auditable numbers grounded in your FieldRoutes data.",
  keywords: [
    "ask your pest control data",
    "natural language analytics pest control",
    "pest control AI assistant",
    "talk to your data",
    "text to SQL pest control",
    "FieldRoutes reporting",
    "conversational business intelligence",
  ],
};

export default function AskPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        badge="Powered by your FieldRoutes data"
        title={
          <>
            Ask Your Pest Control Data{" "}
            <span className="gradient-text">Anything</span>
          </>
        }
        subtitle="Type any question about your business in plain English and get the answer, the breakdown, and the query behind it in seconds. No SQL. No spreadsheets. No waiting on an analyst."
        ctas={[
          { label: "Book a Demo", href: DEMO_BOOKING_URL },
          { label: "See How It Works", href: "#features", variant: "secondary" },
        ]}
        image={{
          src: "/product/ask-answer.png",
          alt: "Asking ElevatePCO for production revenue and getting an instant answer with the data behind it",
          width: 1320,
          height: 860,
        }}
      />

      {/* Features */}
      <div id="features">
        <FeatureGrid
          title="A New Way to See Your Business"
          subtitle="Everything you want to know about your operation, one question away."
          features={askFeatures}
        />
      </div>

      {/* How It Works */}
      <HowItWorks
        title="From Question to Answer in Seconds"
        subtitle="Connect once, then just start asking."
        steps={askSteps}
      />

      {/* Social Proof */}
      <SocialProof stats={askStats} />

      {/* FAQ */}
      <FAQ items={askFAQ} />

      {/* CTA */}
      <CTASection
        title="Stop Digging Through Reports. Just Ask."
        subtitle="Book a demo and ask your own data a question live."
        ctaText="Book a Demo"
        ctaHref={DEMO_BOOKING_URL}
      />
    </>
  );
}
