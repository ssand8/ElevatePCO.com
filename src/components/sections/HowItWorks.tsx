import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
}

export function HowItWorks({
  title = "How It Works",
  subtitle,
  steps,
}: HowItWorksProps) {
  return (
    <section className="py-20 lg:py-28 bg-bg-secondary">
      <Container>
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.number} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                {/* Connector line (hidden on mobile, shown between cards on desktop) */}
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] hidden h-px bg-gradient-to-r from-accent-blue/40 to-accent-emerald/40 md:block" />
                )}

                {/* Number circle */}
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-emerald text-xl font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary max-w-xs">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
