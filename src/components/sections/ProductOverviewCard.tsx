import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

interface ProductOverviewCardProps {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  accentColor?: "blue" | "emerald";
  index: number;
}

export function ProductOverviewCard({
  title,
  tagline,
  description,
  features,
  href,
  accentColor = "blue",
  index,
}: ProductOverviewCardProps) {
  const colorMap = {
    blue: {
      border: "hover:border-accent-blue/30",
      bg: "from-accent-blue/5",
      bullet: "bg-accent-blue",
      link: "text-accent-blue hover:text-accent-blue-hover",
    },
    emerald: {
      border: "hover:border-accent-emerald/30",
      bg: "from-accent-emerald/5",
      bullet: "bg-accent-emerald",
      link: "text-accent-emerald hover:text-accent-emerald-hover",
    },
  };

  const colors = colorMap[accentColor];

  return (
    <AnimateOnScroll delay={index * 0.15}>
      <div
        className={`group rounded-xl border border-border-custom bg-gradient-to-br ${colors.bg} to-transparent p-8 transition-all duration-300 ${colors.border} h-full flex flex-col`}
      >
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-2">
          {tagline}
        </p>
        <h3 className="text-2xl font-bold text-text-primary mb-3">{title}</h3>
        <p className="text-text-secondary mb-6">{description}</p>

        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary">
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full ${colors.bullet} shrink-0`}
              />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className={`inline-flex items-center gap-2 text-sm font-medium ${colors.link} transition-colors`}
        >
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </AnimateOnScroll>
  );
}
