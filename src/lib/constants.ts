export const SITE_NAME = "ElevatePCO";
export const SITE_URL = "https://elevatepco.com";
export const SITE_DESCRIPTION =
  "The complete pest control software suite — sales performance, permits, compliance, operations efficiency, and business finance. Powered by FieldRoutes.";

// Update this with the real booking URL (Calendly, HubSpot, etc.)
export const DEMO_BOOKING_URL = "#book-demo";

export interface NavDropdownItem {
  label: string;
  href: string;
  description: string;
}

export interface NavLink {
  label: string;
  href?: string;
  children?: NavDropdownItem[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Door to Door",
    children: [
      { label: "Permits", href: "/#permits", description: "Permit tracking for D2D teams" },
      { label: "Sales Performance", href: "/dashboards", description: "Real-time leaderboards & KPIs" },
    ],
  },
  {
    label: "Operations",
    children: [
      { label: "Compliance", href: "/compliance", description: "Automated compliance docs" },
      { label: "Operations Efficiency", href: "/#operations-efficiency", description: "Optimize service delivery" },
    ],
  },
  {
    label: "Business Finance",
    href: "/#business-finance",
  },
];

export const FOOTER_LINKS = {
  products: [
    { label: "Permits", href: "/#permits" },
    { label: "Sales Performance", href: "/dashboards" },
    { label: "Compliance", href: "/compliance" },
    { label: "Operations Efficiency", href: "/#operations-efficiency" },
    { label: "Business Finance", href: "/#business-finance" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/eula" },
  ],
};
