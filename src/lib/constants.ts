export const SITE_NAME = "ElevatePCO";
export const SITE_URL = "https://elevatepco.com";
export const SITE_DESCRIPTION =
  "ElevatePCO connects FieldRoutes, your phones, CRM and ad accounts, finds the leads and customers slipping through, and puts each one in front of the person who can fix it.";

export const CONTACT_URL = "mailto:support@elevatepco.com";

// Replace with the real booking URL (Calendly, HubSpot, etc.) when there is one.
export const DEMO_BOOKING_URL = "mailto:support@elevatepco.com?subject=ElevatePCO%20demo%20request";

export const LOGIN_URL = "https://app.elevatepco.com/login";

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
  { label: "Results", href: "/#results" },
  {
    label: "Products",
    children: [
      { label: "Sales Performance", href: "/dashboards", description: "Leaderboards, scorecards & commissions" },
      { label: "Compliance", href: "/compliance", description: "Automated compliance docs" },
      { label: "Ask Your Data", href: "/ask", description: "Plain-English answers from your data" },
    ],
  },
];

export const FOOTER_LINKS = {
  products: [
    { label: "Ask Your Data", href: "/ask" },
    { label: "Sales Performance", href: "/dashboards" },
    { label: "Compliance", href: "/compliance" },
  ],
  company: [
    { label: "Contact", href: CONTACT_URL },
    { label: "Text Alerts", href: "/sms-opt-in" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Terms of Service", href: "/eula" },
  ],
};
