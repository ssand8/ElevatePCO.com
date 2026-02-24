import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FOOTER_LINKS, DEMO_BOOKING_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border-custom bg-bg-secondary">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block">
                <span className="text-xl font-bold text-text-primary">
                  ELEVATE<span className="text-accent-blue">PCO</span>
                </span>
              </Link>
              <p className="mt-3 text-sm text-text-secondary">
                Software built for pest control growth. Integrates with FieldRoutes.
              </p>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Products</h3>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.products.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Company</h3>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Legal</h3>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-custom pt-8 sm:flex-row">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} ElevatePCO. All rights reserved.
            </p>
            <Link
              href={DEMO_BOOKING_URL}
              className="text-sm font-medium text-accent-blue transition-colors hover:text-accent-blue-hover"
            >
              Book a Demo &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
