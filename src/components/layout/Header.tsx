"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS, DEMO_BOOKING_URL } from "@/lib/constants";
import type { NavLink, NavDropdownItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

function DesktopDropdown({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        onClick={() => setOpen(!open)}
      >
        {link.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="w-64 rounded-lg border border-border-custom bg-bg-secondary/95 backdrop-blur-lg p-2 shadow-xl">
            {link.children!.map((item: NavDropdownItem) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 transition-colors hover:bg-bg-tertiary"
              >
                <span className="block text-sm font-medium text-text-primary">
                  {item.label}
                </span>
                <span className="block text-xs text-text-muted mt-0.5">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-lg border-b border-border-custom"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-text-primary">
              ELEVATE<span className="text-accent-blue">PCO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <DesktopDropdown key={link.label} link={link} />
              ) : (
                <Link
                  key={link.label}
                  href={link.href!}
                  className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </Link>
              )
            )}
            <Button href={DEMO_BOOKING_URL} size="sm">
              Book a Demo
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-custom bg-bg-primary/95 backdrop-blur-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Container>
            <div className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className="flex w-full items-center justify-between py-3 text-base font-medium text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          mobileDropdowns[link.label] && "rotate-180"
                        )}
                      />
                    </button>
                    {mobileDropdowns[link.label] && (
                      <div className="pl-4 pb-2 space-y-1">
                        {link.children.map((item: NavDropdownItem) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-base font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Button href={DEMO_BOOKING_URL} className="mt-4 w-full">
                Book a Demo
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
