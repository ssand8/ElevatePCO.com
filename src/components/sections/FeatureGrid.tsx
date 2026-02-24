import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard, type FeatureItem } from "./FeatureCard";

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: FeatureItem[];
  columns?: 2 | 3;
}

export function FeatureGrid({
  title,
  subtitle,
  features,
  columns = 3,
}: FeatureGridProps) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading title={title} subtitle={subtitle} />
        <div
          className={`grid gap-6 sm:grid-cols-2 ${
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
