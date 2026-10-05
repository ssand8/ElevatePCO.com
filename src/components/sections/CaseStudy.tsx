import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export interface CaseStudyResult {
  value: string;
  label: string;
  before: string;
  after: string;
}

interface CaseStudyProps {
  title: string;
  subtitle?: string;
  results: CaseStudyResult[];
  footnote?: string;
}

export function CaseStudy({ title, subtitle, results, footnote }: CaseStudyProps) {
  return (
    <section id="results" className="py-20 lg:py-28 bg-bg-secondary">
      <Container>
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="grid gap-6 sm:grid-cols-2">
          {results.map((result, i) => (
            <AnimateOnScroll key={result.label} delay={i * 0.1}>
              <div className="glow-card flex h-full flex-col rounded-xl border border-border-custom bg-bg-primary p-6 lg:p-8">
                <span className="text-4xl font-bold gradient-text lg:text-5xl">
                  {result.value}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">
                  {result.label}
                </h3>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border-custom pt-4 text-sm">
                  <div>
                    <dt className="text-text-muted">Before</dt>
                    <dd className="mt-1 text-text-secondary">{result.before}</dd>
                  </div>
                  <div>
                    <dt className="text-accent-emerald">With Elevate</dt>
                    <dd className="mt-1 text-text-primary">{result.after}</dd>
                  </div>
                </dl>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        {footnote && (
          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-text-muted">
            {footnote}
          </p>
        )}
      </Container>
    </section>
  );
}
