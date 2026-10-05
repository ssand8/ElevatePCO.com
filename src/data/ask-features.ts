import {
  MessagesSquare,
  Code2,
  Sparkles,
  Bookmark,
  Database,
  Gauge,
} from "lucide-react";
import type { FeatureItem } from "@/components/sections/FeatureCard";
import type { Step } from "@/components/sections/HowItWorks";
import type { FAQItem } from "@/components/sections/FAQ";
import type { Stat } from "@/components/sections/SocialProof";

export const askFeatures: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Ask in Plain English",
    description:
      "No SQL, no report builder, no waiting on an analyst. Type a question the way you would ask a teammate and get the number back in seconds: production revenue, churn, close rates, technician output, lead-source ROI, and more.",
  },
  {
    icon: MessagesSquare,
    title: "Follow Up Naturally",
    description:
      "Keep the conversation going. Ask a question, then refine it: now break that down by office, change it to the last 90 days, or only recurring accounts. Each answer builds on the last, just like talking to your data.",
  },
  {
    icon: Gauge,
    title: "Watch It Work in Real Time",
    description:
      "Answers stream back as they are written, with live progress so you always know what is happening: querying your data, reading the results, and composing the answer. No spinning loader, no black box.",
  },
  {
    icon: Code2,
    title: "See the Numbers Behind the Answer",
    description:
      "Every answer can show the exact query it ran and the raw results it used. The numbers are auditable, not a guess, so you can trust them in a meeting or hand them to your accountant.",
  },
  {
    icon: Bookmark,
    title: "Save Any Answer to a Dashboard",
    description:
      "Found a number worth watching? Save it to a dashboard with one click. Chat is for exploring; dashboards are what you keep and check every day.",
  },
  {
    icon: Database,
    title: "Grounded in Your Real Data",
    description:
      "Answers come straight from your own FieldRoutes data, synced automatically and kept source-faithful. One recent April production figure matched FieldRoutes to within $7 on roughly $180,000.",
  },
];

export const askSteps: Step[] = [
  {
    number: 1,
    title: "Connect FieldRoutes",
    description:
      "We sync your subscriptions, appointments, employees, customers, and invoices automatically. No spreadsheets, no manual imports.",
  },
  {
    number: 2,
    title: "Ask Your Question",
    description:
      "Type any question about your business in plain English and get the answer, the breakdown, and the query behind it in seconds.",
  },
  {
    number: 3,
    title: "Save What Matters",
    description:
      "Turn the answers you care about into live dashboard tiles, and let scheduled reports email them to your team.",
  },
];

export const askFAQ: FAQItem[] = [
  {
    question: "Do I need to know SQL or be technical?",
    answer:
      "No. That is the whole point. You ask questions in plain English, the same way you would ask a manager. There is no query language, no report builder, and no setup beyond connecting FieldRoutes.",
  },
  {
    question: "How do I know the answers are accurate?",
    answer:
      "Every answer can show the exact query it ran and the raw rows it used, so the math is fully auditable. Your data is kept source-faithful to FieldRoutes. In one recent check, an April production figure came back within $7 of the FieldRoutes Production Report on roughly $180,000.",
  },
  {
    question: "Can I ask follow-up questions?",
    answer:
      "Yes. Conversations are multi-turn, so you can refine an answer without starting over. Ask for production revenue, then say now by office, then change to last quarter, and each answer builds on the one before it.",
  },
  {
    question: "What kinds of questions can I ask?",
    answer:
      "Anything in your operational data: sold and serviced revenue, recurring churn and cancellations, close rates, technician production and reviews, lead-source performance and return on ad spend, and more. If it is in FieldRoutes, you can ask about it.",
  },
  {
    question: "What if I want to keep an answer around?",
    answer:
      "Save it to a dashboard with one click. Chat is built for exploration, and dashboards are what you keep. You can also schedule any dashboard to email your team on a recurring basis.",
  },
  {
    question: "Is my company data private?",
    answer:
      "Yes. Each company's data is isolated, and role-based access controls who can see what inside your organization. You are only ever asking questions of your own data.",
  },
];

export const askStats: Stat[] = [
  { value: "Seconds", label: "From plain-English question to answer" },
  { value: "Zero", label: "SQL, spreadsheets, or report building required" },
  { value: "100%", label: "Answers grounded in your own FieldRoutes data" },
];
