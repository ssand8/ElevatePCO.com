import { Hero } from "@/components/sections/Hero";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  homepageCategories,
  homepageValueProps,
  homepageStats,
} from "@/data/homepage";
import { DEMO_BOOKING_URL } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        title={
          <>
            Software Built for{" "}
            <span className="gradient-text">Pest Control Growth</span>
          </>
        }
        subtitle="The complete software suite for pest control companies — sales performance, permits, compliance, operations efficiency, and business finance. All powered by your FieldRoutes data."
        ctas={[
          { label: "Explore Products", href: "#products" },
          {
            label: "Book a Demo",
            href: DEMO_BOOKING_URL,
            variant: "secondary",
          },
        ]}
        fullHeight
      />

      {/* Products by Category */}
      <section id="products" className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title="The Complete Pest Control Platform"
            subtitle="Five products across three categories — all purpose-built for pest control and powered by your FieldRoutes data."
          />
          <div className="space-y-20">
            {homepageCategories.map((category, i) => (
              <CategorySection
                key={category.id}
                category={category}
                categoryIndex={i}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Value Props */}
      <FeatureGrid
        title="Why ElevatePCO?"
        subtitle="Built by people who understand pest control operations."
        features={homepageValueProps}
      />

      {/* Social Proof */}
      <SocialProof stats={homepageStats} />

      {/* CTA */}
      <CTASection
        title="Ready to Elevate Your Pest Control Business?"
        subtitle="Book a demo and see how ElevatePCO transforms your operations."
        ctaText="Book a Demo"
        ctaHref={DEMO_BOOKING_URL}
      />
    </>
  );
}
