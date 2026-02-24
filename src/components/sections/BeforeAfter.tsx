import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { X, Check } from "lucide-react";

interface BeforeAfterProps {
  beforeItems: string[];
  afterItems: string[];
}

export function BeforeAfter({ beforeItems, afterItems }: BeforeAfterProps) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Before & After"
          subtitle="See the difference Elevate Compliance makes."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <AnimateOnScroll direction="left">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 h-full">
              <h3 className="mb-6 text-lg font-semibold text-red-400">
                Without Elevate Compliance
              </h3>
              <ul className="space-y-4">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* After */}
          <AnimateOnScroll direction="right">
            <div className="rounded-xl border border-accent-emerald/20 bg-accent-emerald/5 p-8 h-full">
              <h3 className="mb-6 text-lg font-semibold text-accent-emerald">
                With Elevate Compliance
              </h3>
              <ul className="space-y-4">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-emerald" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
