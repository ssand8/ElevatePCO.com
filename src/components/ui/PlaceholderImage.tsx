import { cn } from "@/lib/utils";
import { Monitor, FileText } from "lucide-react";

interface PlaceholderImageProps {
  label: string;
  type?: "dashboard" | "document";
  aspectRatio?: string;
  className?: string;
}

export function PlaceholderImage({
  label,
  type = "dashboard",
  aspectRatio = "aspect-video",
  className,
}: PlaceholderImageProps) {
  const Icon = type === "dashboard" ? Monitor : FileText;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border-custom bg-gradient-to-br from-accent-blue/5 to-accent-emerald/5",
        aspectRatio,
        className
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
        <Icon className="h-12 w-12 text-accent-blue/30" />
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      {/* Decorative grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-50" />
    </div>
  );
}
