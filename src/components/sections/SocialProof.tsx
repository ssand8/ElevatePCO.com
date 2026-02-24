import { Container } from "@/components/ui/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export interface Stat {
  value: string;
  label: string;
}

interface SocialProofProps {
  stats: Stat[];
}

export function SocialProof({ stats }: SocialProofProps) {
  return (
    <section className="py-20 lg:py-28 bg-bg-secondary">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <AnimateOnScroll key={stat.label} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center p-6">
                <span className="text-4xl font-bold gradient-text lg:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm text-text-secondary">
                  {stat.label}
                </span>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
