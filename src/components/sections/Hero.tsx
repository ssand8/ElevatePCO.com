import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

interface HeroCTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
}

interface HeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  ctas: HeroCTA[];
  imagePlaceholder?: string;
  imageType?: "dashboard" | "document";
  fullHeight?: boolean;
}

export function Hero({
  badge,
  title,
  subtitle,
  ctas,
  imagePlaceholder,
  imageType = "dashboard",
  fullHeight = false,
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${
        fullHeight ? "min-h-screen" : "pt-32 pb-20 lg:pt-40 lg:pb-28"
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-accent-blue/5 rounded-full blur-3xl" />

      <Container className="relative">
        <div
          className={`flex flex-col items-center gap-12 lg:gap-16 ${
            imagePlaceholder ? "lg:flex-row lg:items-center" : ""
          } ${fullHeight ? "min-h-screen justify-center pt-20" : ""}`}
        >
          {/* Text content */}
          <div
            className={`flex flex-col ${
              imagePlaceholder ? "lg:w-1/2" : "max-w-3xl"
            } ${imagePlaceholder ? "items-start text-left" : "items-center text-center"}`}
          >
            <AnimateOnScroll>
              {badge && <Badge className="mb-6">{badge}</Badge>}
              <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 text-lg text-text-secondary sm:text-xl max-w-2xl">
                {subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {ctas.map((cta) => (
                  <Button
                    key={cta.label}
                    href={cta.href}
                    variant={cta.variant || "primary"}
                    size="lg"
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Image */}
          {imagePlaceholder && (
            <AnimateOnScroll direction="right" delay={0.2} className="lg:w-1/2 w-full">
              <PlaceholderImage
                label={imagePlaceholder}
                type={imageType}
                className="shadow-2xl shadow-accent-blue/10"
              />
            </AnimateOnScroll>
          )}
        </div>
      </Container>
    </section>
  );
}
