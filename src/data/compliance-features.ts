import {
  FileText,
  Columns2,
  RefreshCw,
  Building2,
  LayoutTemplate,
  Search,
} from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Step } from "@/components/sections/HowItWorks";
import type { FAQItem } from "@/components/sections/FAQ";

export const complianceFeatures: FeatureItem[] = [
  {
    icon: FileText,
    title: "Automated Written Instructions",
    description:
      "Supervisors create templates defining chemicals, dilutions, application rates, target pests, locations, and precautionary statements. Templates auto-match to appointments — no manual lookup required.",
  },
  {
    icon: Columns2,
    title: "Side-by-Side Permanent Records",
    description:
      "Dual-column view showing prescribed treatment (from written instructions) alongside actual treatment performed (synced from FieldRoutes). Exactly what regulators want to see.",
  },
  {
    icon: RefreshCw,
    title: "FieldRoutes Integration",
    description:
      "Syncs appointments, technicians, supervisors, chemicals (with EPA numbers and active ingredients), service types, customers, and chemical usage data. No double entry.",
  },
  {
    icon: Building2,
    title: "Multi-Location Management",
    description:
      "Role-based access from Admin to Technician. Manage compliance across multiple offices. Admins see everything, branch managers manage their team, technicians see their own appointments.",
  },
  {
    icon: LayoutTemplate,
    title: "Smart Template System",
    description:
      "Auto-fills chemical defaults from your master data. Validates date ranges to prevent overlaps. Duplicate templates in one click. Assign multiple technicians and service types per template.",
  },
  {
    icon: Search,
    title: "Instant Appointment Lookup",
    description:
      "Search by appointment ID, customer name, customer ID, or date range. Pull up full written instructions and permanent records in seconds — ready for an auditor at any moment.",
  },
];

export const complianceSteps: Step[] = [
  {
    number: 1,
    title: "Connect FieldRoutes",
    description:
      "We sync your employees, chemicals, appointments, and service data automatically from FieldRoutes.",
  },
  {
    number: 2,
    title: "Create Templates",
    description:
      "Supervisors set up written instruction templates for technicians by service type and date range. Chemical defaults auto-fill.",
  },
  {
    number: 3,
    title: "Stay Compliant",
    description:
      "Every appointment auto-matches to its written instructions. Pull up any record instantly for audits or inspections.",
  },
];

export const complianceFAQ: FAQItem[] = [
  {
    question: "What are Written Instructions and Permanent Records?",
    answer:
      "Written Instructions are regulatory documents that prescribe how treatments should be applied — which chemicals, at what rates, for which pests. Permanent Records document what was actually applied during each service. Together they form the compliance documentation required by state regulators like CT DEEP.",
  },
  {
    question: "How does it connect to FieldRoutes?",
    answer:
      "Elevate Compliance syncs directly with your FieldRoutes account, pulling in appointments, technicians, supervisors, chemicals (including EPA numbers and active ingredients), service types, and chemical usage data. No manual data entry needed.",
  },
  {
    question: "Can I manage multiple branches?",
    answer:
      "Yes. The platform includes role-based access (Admin, Regional Manager, Branch Manager, Rep, Technician) so you can manage compliance across multiple offices while ensuring each team only sees what's relevant to them.",
  },
  {
    question: "What happens during a regulatory audit?",
    answer:
      "Search by appointment ID, customer name, customer ID, or date range and pull up the full written instructions and permanent record for any appointment in seconds. The side-by-side prescribed vs. actual format is exactly what regulators look for.",
  },
  {
    question: "How do templates work?",
    answer:
      "Supervisors create templates that define chemicals, dilutions, application rates, target pests, and precautionary statements for specific technicians and service types within a date range. The system auto-matches templates to appointments, eliminating manual lookups.",
  },
  {
    question: "Does it handle chemical data automatically?",
    answer:
      "Yes. Chemical defaults including dilution rates, application rates, target pests, and application methods auto-fill from your chemical master data. EPA registration numbers and active ingredients are tracked for every chemical.",
  },
];

export const complianceBeforeItems = [
  "Hours spent filling out written instructions manually on paper or spreadsheets",
  "Days to compile documentation when regulators request records",
  "Templates get reused incorrectly as you add technicians and branches",
  "Date ranges overlap and compliance gaps appear without warning",
  "No connection between what was prescribed and what was actually applied",
];

export const complianceAfterItems = [
  "Written Instructions auto-generated from reusable templates in seconds",
  "Pull up any appointment's full compliance record instantly",
  "Smart template system prevents overlaps and auto-validates date ranges",
  "Scales effortlessly as you add technicians, branches, and service types",
  "Side-by-side prescribed vs. actual treatment records for every appointment",
];
