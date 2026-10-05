import { Hero } from "@/components/sections/Hero";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CTASection } from "@/components/sections/CTASection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import {
  homepageLeaks,
  homepageCaseStudy,
  homepageCaseStudyFootnote,
  homepageOutcomes,
  homepageSteps,
  homepageIntegrations,
  homepageCategories,
} from "@/data/homepage";
import { DEMO_BOOKING_URL } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        badge="Built for pest control companies on FieldRoutes"
        title={
          <>
            Stop losing the jobs you{" "}
            <span className="gradient-text">already paid to get</span>
          </>
        }
        subtitle="ElevatePCO connects FieldRoutes, your phones, your CRM and your ad accounts, finds the leads and customers slipping through, and puts each one in front of the person who can fix it while it can still be fixed."
        ctas={[
          { label: "Book a Demo", href: DEMO_BOOKING_URL },
          { label: "See the Results", href: "#results", variant: "secondary" },
        ]}
        fullHeight
      />

      {/* The leaks */}
      <FeatureGrid
        title="Where the money slips away"
        subtitle="Good data isn't the hard part. These are real leaks we found at one company, all hiding in systems that looked fine."
        features={homepageLeaks}
        columns={2}
      />

      {/* Case study */}
      <CaseStudy
        title="What changed when the team got Elevate"
        subtitle="One multi-branch pest control company, before and after."
        results={homepageCaseStudy}
        footnote={homepageCaseStudyFootnote}
      />

      {/* Outcomes */}
      <FeatureGrid
        title="What your team gets"
        subtitle="Every feature exists to move one of these numbers."
        features={homepageOutcomes}
      />

      {/* How it works */}
      <HowItWorks
        subtitle="Live in days, not months."
        steps={homepageSteps}
      />

      {/* Integrations */}
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading
            title="Works with the tools you already use"
            subtitle="The value is in joining them. A missed call means more when you know whether the caller is already a customer."
          />
          <AnimateOnScroll>
            <ul className="flex flex-wrap justify-center gap-3">
              {homepageIntegrations.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-border-custom bg-bg-secondary px-4 py-2 text-sm text-text-secondary"
                >
                  {name}
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        </Container>
      </section>

      {/* Products */}
      <section className="py-20 lg:py-28 bg-bg-secondary">
        <Container>
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

      {/* CTA */}
      <CTASection
        title="Find out what your data is hiding"
        subtitle="Book a demo and we'll show you where your leads and revenue are slipping through."
        ctaText="Book a Demo"
        ctaHref={DEMO_BOOKING_URL}
      />
    </>
  );
}
