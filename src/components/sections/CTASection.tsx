import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { DEMO_BOOKING_URL } from "@/lib/constants";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function CTASection({
  title = "Ready to Elevate Your Business?",
  subtitle = "Book a demo and see how ElevatePCO can transform your pest control operations.",
  ctaText = "Book a Demo",
  ctaHref = DEMO_BOOKING_URL,
}: CTASectionProps) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-bg-primary to-accent-emerald/10" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <Container className="relative">
        <AnimateOnScroll>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl max-w-2xl">
              {title}
            </h2>
            <p className="mt-4 text-lg text-text-secondary max-w-xl">
              {subtitle}
            </p>
            <Button href={ctaHref} size="lg" className="mt-8">
              {ctaText}
            </Button>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
