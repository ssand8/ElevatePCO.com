import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ElevatePCO Privacy Policy — how we collect, use, and protect your data, including data accessed through QuickBooks Online and FieldRoutes integrations.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Effective Date: March 14, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
            {/* Introduction */}
            <div>
              <p>
                ElevatePCO (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                operates the ElevatePCO platform, including the website at
                elevatepco.com and related services (collectively, the
                &quot;Service&quot;). This Privacy Policy describes how we
                collect, use, store, share, and protect your information when
                you use our Service, including data accessed through our
                integrations with Intuit QuickBooks Online
                (&quot;QuickBooks&quot;) and FieldRoutes.
              </p>
              <p className="mt-3">
                By accessing or using the Service, you agree to the terms of
                this Privacy Policy. If you do not agree, please do not use the
                Service.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                1. Information We Collect
              </h2>

              <h3 className="mb-2 font-medium text-text-primary">
                1.1 Information You Provide
              </h3>
              <ul className="mb-4 list-disc space-y-1 pl-5">
                <li>
                  Account registration information (name, email address,
                  company name, phone number)
                </li>
                <li>Billing and payment information</li>
                <li>
                  Communications you send to us (support requests, feedback)
                </li>
              </ul>

              <h3 className="mb-2 font-medium text-text-primary">
                1.2 Information from QuickBooks Online
              </h3>
              <p className="mb-2">
                When you connect your QuickBooks Online account, we may access
                the following data through the Intuit API, based on the
                permissions you authorize:
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5">
                <li>Company information and settings</li>
                <li>Customer and vendor records</li>
                <li>Invoice, payment, and transaction data</li>
                <li>Account and financial report data</li>
                <li>Employee information (name, role, compensation data)</li>
              </ul>
              <p className="mb-4">
                We do not access or store Social Security numbers (SSNs),
                Employer Identification Numbers (EINs), or bank account
                credentials through QuickBooks.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                1.3 Information from FieldRoutes
              </h3>
              <p className="mb-2">
                When you connect your FieldRoutes account, we may access:
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5">
                <li>Service route and scheduling data</li>
                <li>Customer and account records</li>
                <li>Technician and employee information</li>
                <li>
                  Chemical application and compliance documentation data
                </li>
                <li>Sales and revenue data</li>
              </ul>

              <h3 className="mb-2 font-medium text-text-primary">
                1.4 Automatically Collected Information
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Device and browser information (IP address, browser type,
                  operating system)
                </li>
                <li>
                  Usage data (pages visited, features used, timestamps)
                </li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                2. How We Use Your Information
              </h2>
              <p className="mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Provide, operate, and maintain the Service</li>
                <li>
                  Generate dashboards, reports, and compliance documentation
                </li>
                <li>
                  Sync and display data from QuickBooks Online and FieldRoutes
                </li>
                <li>Process transactions and send billing communications</li>
                <li>Respond to support requests and communicate with you</li>
                <li>
                  Improve the Service, including analytics and performance
                  monitoring
                </li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal information or QuickBooks data. We
                do not use your QuickBooks data for purposes unrelated to the
                Service you have authorized.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                3. How We Share Your Information
              </h2>
              <p className="mb-2">
                We may share your information only in the following
                circumstances:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Service Providers:</strong> With trusted third-party
                  vendors who assist in operating the Service (hosting, payment
                  processing, analytics), subject to confidentiality
                  obligations.
                </li>
                <li>
                  <strong>Intuit / QuickBooks:</strong> Data is transmitted
                  to and from QuickBooks Online through the Intuit API as
                  necessary to provide the Service.
                </li>
                <li>
                  <strong>FieldRoutes:</strong> Data is transmitted to and from
                  FieldRoutes as necessary to provide the Service.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or governmental authority.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets, with notice to
                  affected users.
                </li>
              </ul>
              <p className="mt-3">
                We do not share your QuickBooks data with unrelated third
                parties for their own marketing or commercial purposes.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                4. Data Storage and Security
              </h2>
              <p>
                We implement industry-standard security measures to protect
                your information, including encryption in transit (TLS/SSL) and
                at rest, access controls, and regular security assessments. API
                credentials, tokens, and secrets are stored securely and are
                never hardcoded or exposed in client-side code or browser logs.
              </p>
              <p className="mt-3">
                While we strive to protect your data, no method of electronic
                transmission or storage is completely secure. We cannot
                guarantee absolute security.
              </p>
            </div>

            {/* 5 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                5. Data Retention and Deletion
              </h2>
              <p>
                We retain your data for as long as your account is active or as
                needed to provide the Service. When you disconnect your
                QuickBooks Online or FieldRoutes account, or close your
                ElevatePCO account, we will delete or anonymize your
                integration data within 30 days, unless retention is required by
                law.
              </p>
              <p className="mt-3">
                You may request deletion of your data at any time by contacting
                us at{" "}
                <a
                  href="mailto:support@elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  support@elevatepco.com
                </a>
                .
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                6. Your Rights
              </h2>
              <p className="mb-2">
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Access the personal information we hold about you</li>
                <li>
                  Request correction of inaccurate or incomplete information
                </li>
                <li>Request deletion of your personal information</li>
                <li>
                  Object to or restrict certain processing of your information
                </li>
                <li>
                  Withdraw consent for data processing (where consent is the
                  legal basis)
                </li>
                <li>
                  Disconnect your QuickBooks Online or FieldRoutes account at
                  any time through the Service settings
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:support@elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  support@elevatepco.com
                </a>
                .
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                7. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar technologies to maintain session
                state, remember preferences, and analyze usage patterns. You
                can control cookie settings through your browser. Disabling
                cookies may limit certain features of the Service.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                8. California Privacy Rights (CCPA)
              </h2>
              <p>
                If you are a California resident, you have the right to request
                disclosure of the categories and specific pieces of personal
                information we have collected, request deletion of your personal
                information, and opt out of the sale of personal information. We
                do not sell personal information. To make a request, contact us
                at{" "}
                <a
                  href="mailto:support@elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  support@elevatepco.com
                </a>
                .
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                9. Children&apos;s Privacy
              </h2>
              <p>
                The Service is not directed to individuals under 18 years of
                age. We do not knowingly collect personal information from
                children. If we become aware that we have collected information
                from a child, we will take steps to delete it promptly.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                10. Third-Party Links
              </h2>
              <p>
                The Service may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                those third parties. We encourage you to review their privacy
                policies before providing any information.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                11. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the updated policy on
                this page and updating the &quot;Effective Date&quot; above. If
                changes are significant, we will provide additional notice (such
                as via email or an in-app notification). Your continued use of
                the Service after changes constitutes acceptance of the updated
                policy.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                12. Contact Us
              </h2>
              <p>
                If you have questions or concerns about this Privacy Policy or
                our data practices, contact us at:
              </p>
              <p className="mt-3">
                ElevatePCO
                <br />
                Email:{" "}
                <a
                  href="mailto:support@elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  support@elevatepco.com
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  elevatepco.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
