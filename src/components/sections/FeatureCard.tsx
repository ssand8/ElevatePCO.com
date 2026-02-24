import { type LucideIcon } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps extends FeatureItem {
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <AnimateOnScroll delay={index * 0.1}>
      <div className="glow-card group rounded-xl border border-border-custom bg-bg-secondary p-6 transition-all duration-300 hover:bg-bg-tertiary h-full">
        <div className="mb-4 inline-flex rounded-lg bg-accent-blue/10 p-3">
          <Icon className="h-6 w-6 text-accent-blue" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
      </div>
    </AnimateOnScroll>
  );
}
