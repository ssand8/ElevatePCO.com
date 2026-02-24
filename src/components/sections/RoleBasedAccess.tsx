import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { type LucideIcon } from "lucide-react";

export interface RoleItem {
  icon: LucideIcon;
  role: string;
  description: string;
}

interface RoleBasedAccessProps {
  roles: RoleItem[];
}

export function RoleBasedAccess({ roles }: RoleBasedAccessProps) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="Role-Based Access"
          subtitle="Everyone sees exactly what they need. No more, no less."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateOnScroll key={item.role} delay={i * 0.1}>
                <div className="rounded-xl border border-border-custom bg-bg-secondary p-6 transition-all duration-300 hover:bg-bg-tertiary h-full">
                  <div className="mb-3 inline-flex rounded-lg bg-accent-blue/10 p-2.5">
                    <Icon className="h-5 w-5 text-accent-blue" />
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-text-primary">
                    {item.role}
                  </h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
