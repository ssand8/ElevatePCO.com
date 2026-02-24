import { Hero } from "@/components/sections/Hero";
import { ProductOverviewCard } from "@/components/sections/ProductOverviewCard";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  homepageProducts,
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
        subtitle="Real-time performance dashboards and automated compliance documentation — powered by your FieldRoutes data. Stop guessing, stop chasing paperwork, start winning."
        ctas={[
          { label: "Explore Dashboards", href: "/dashboards" },
          {
            label: "Explore Compliance",
            href: "/compliance",
            variant: "secondary",
          },
        ]}
        fullHeight
      />

      {/* Products Overview */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title="Two Products. One Mission."
            subtitle="Everything your pest control company needs to perform better and stay compliant."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {homepageProducts.map((product, i) => (
              <ProductOverviewCard key={product.title} {...product} index={i} />
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
