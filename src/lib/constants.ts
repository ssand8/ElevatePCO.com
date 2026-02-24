export const SITE_NAME = "ElevatePCO";
export const SITE_URL = "https://elevatepco.com";
export const SITE_DESCRIPTION =
  "Performance dashboards and compliance automation built for pest control companies. Integrates with FieldRoutes.";

// Update this with the real booking URL (Calendly, HubSpot, etc.)
export const DEMO_BOOKING_URL = "#book-demo";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboards", href: "/dashboards" },
  { label: "Compliance", href: "/compliance" },
] as const;

export const FOOTER_LINKS = {
  products: [
    { label: "Performance Dashboards", href: "/dashboards" },
    { label: "Compliance", href: "/compliance" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
} as const;
