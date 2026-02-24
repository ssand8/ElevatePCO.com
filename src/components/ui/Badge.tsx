import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-medium text-accent-blue",
        className
      )}
    >
      {children}
    </span>
  );
}
