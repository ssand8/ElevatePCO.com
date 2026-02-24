import { Container } from "@/components/ui/Container";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { Bug, ShieldCheck, FileText, Beaker } from "lucide-react";

const highlights = [
  {
    icon: Beaker,
    title: "Chemical Intelligence",
    description:
      "Auto-fills EPA registration numbers, active ingredients, dilution rates, and application methods from your chemical master data.",
  },
  {
    icon: FileText,
    title: "Regulatory-Ready Documents",
    description:
      "Written Instructions and Permanent Records formatted exactly how state regulators expect to see them.",
  },
  {
    icon: Bug,
    title: "Pest Control Vocabulary",
    description:
      "Built around target pests, precautionary statements, application locations, and treatment methods — not generic compliance templates.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Ready in Seconds",
    description:
      "Pull up any appointment's full compliance documentation instantly. Side-by-side prescribed vs. actual treatment records.",
  },
];

export function BuiltForPestControl() {
  return (
    <section className="py-20 lg:py-28 bg-bg-secondary">
      <Container>
        <AnimateOnScroll>
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Built for <span className="gradient-text">Pest Control</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary mx-auto">
              Not a generic compliance tool. Every feature understands the pest control industry.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-6 sm:grid-cols-2">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateOnScroll key={item.title} delay={i * 0.1}>
                <div className="flex gap-4 rounded-xl border border-border-custom bg-bg-primary p-6 transition-all duration-300 hover:border-accent-emerald/20">
                  <div className="shrink-0">
                    <div className="inline-flex rounded-lg bg-accent-emerald/10 p-2.5">
                      <Icon className="h-5 w-5 text-accent-emerald" />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary">{item.description}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
