"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

function FAQAccordionItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-custom">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-accent-blue"
      >
        <span className="text-base font-medium text-text-primary pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-text-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-text-secondary">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ({
  title = "Frequently Asked Questions",
  subtitle,
  items,
}: FAQProps) {
  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-3xl">
        <SectionHeading title={title} subtitle={subtitle} />
        <div>
          {items.map((item) => (
            <FAQAccordionItem key={item.question} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
