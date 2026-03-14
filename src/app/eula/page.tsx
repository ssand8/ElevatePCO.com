import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "End User License Agreement",
  description:
    "ElevatePCO End User License Agreement — terms governing use of the ElevatePCO platform and its integrations with QuickBooks Online and FieldRoutes.",
};

export default function EULAPage() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            End User License Agreement
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Effective Date: March 14, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
            {/* Introduction */}
            <div>
              <p>
                This End User License Agreement (&quot;Agreement&quot;) is a
                legal agreement between you (&quot;User,&quot; &quot;you,&quot;
                or &quot;your&quot;) and ElevatePCO (&quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) governing your use of the
                ElevatePCO platform, including the website at elevatepco.com,
                software, and related services (collectively, the
                &quot;Service&quot;).
              </p>
              <p className="mt-3">
                By accessing or using the Service, you agree to be bound by
                this Agreement. If you do not agree to these terms, do not
                access or use the Service.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                1. License Grant
              </h2>
              <p>
                Subject to your compliance with this Agreement, we grant you a
                limited, non-exclusive, non-transferable, revocable license to
                access and use the Service for your internal business purposes.
                This license does not include the right to sublicense,
                redistribute, or resell the Service or any part thereof.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                2. Account Registration
              </h2>
              <p>
                You must provide accurate and complete information when creating
                an account. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized access or use of your account.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                3. Third-Party Integrations
              </h2>

              <h3 className="mb-2 font-medium text-text-primary">
                3.1 QuickBooks Online Integration
              </h3>
              <p className="mb-3">
                The Service integrates with Intuit QuickBooks Online through the
                Intuit API. By connecting your QuickBooks account, you authorize
                us to access, retrieve, and display your QuickBooks data as
                necessary to provide the Service. Your use of QuickBooks data
                through the Service is also subject to Intuit&apos;s Terms of
                Service and Privacy Policy. You acknowledge that:
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5">
                <li>
                  We access your QuickBooks data solely to provide the Service
                  features you have authorized.
                </li>
                <li>
                  You may disconnect your QuickBooks account at any time
                  through the Service settings or through your Intuit account.
                </li>
                <li>
                  We store API credentials and tokens securely and do not
                  expose them in client-side code.
                </li>
                <li>
                  We are a third-party application and Intuit is not
                  responsible for our handling of your data.
                </li>
              </ul>

              <h3 className="mb-2 font-medium text-text-primary">
                3.2 FieldRoutes Integration
              </h3>
              <p>
                The Service integrates with FieldRoutes to sync operational
                data. By connecting your FieldRoutes account, you authorize us
                to access and use your FieldRoutes data as necessary to provide
                the Service. You may disconnect your FieldRoutes account at any
                time.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                4. Prohibited Activities
              </h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Reverse engineer, decompile, disassemble, or attempt to
                  derive the source code of the Service
                </li>
                <li>
                  Copy, modify, or create derivative works based on the Service
                </li>
                <li>
                  Rent, lease, lend, sell, sublicense, or transfer access to the
                  Service to any third party
                </li>
                <li>
                  Remove, alter, or obscure any copyright, trademark, or other
                  proprietary notices
                </li>
                <li>
                  Use the Service for any unlawful, fraudulent, or malicious
                  purpose
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service or its underlying infrastructure
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service, other
                  user accounts, or related systems or networks
                </li>
                <li>
                  Use the Service to store or transmit malicious code, viruses,
                  or harmful data
                </li>
                <li>
                  Access the Intuit API or FieldRoutes API except through the
                  authorized interfaces provided by the Service
                </li>
                <li>
                  Use data obtained through the Service for purposes unrelated
                  to your authorized use of the Service
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                5. Data Handling and Privacy
              </h2>
              <p>
                Your use of the Service is also governed by our{" "}
                <a
                  href="/privacy"
                  className="text-accent-blue hover:underline"
                >
                  Privacy Policy
                </a>
                , which describes how we collect, use, store, and protect your
                information, including data accessed through QuickBooks Online
                and FieldRoutes. You are responsible for ensuring that you have
                all necessary rights and permissions to share your data with us
                through the Service.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                6. Intellectual Property
              </h2>
              <p>
                The Service, including all software, content, designs,
                trademarks, and documentation, is the exclusive property of
                ElevatePCO or its licensors and is protected by intellectual
                property laws. This Agreement does not grant you any ownership
                rights in the Service. You retain ownership of your data that
                you provide to or access through the Service.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                7. Fees and Payment
              </h2>
              <p>
                Access to the Service may require payment of fees as described
                on our website or in a separate order form. All fees are
                non-refundable unless otherwise stated. We reserve the right to
                change fees upon reasonable notice. Failure to pay fees may
                result in suspension or termination of your access to the
                Service.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                8. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
                IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
                UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS WILL
                BE CORRECTED.
              </p>
              <p className="mt-3">
                WE ARE NOT RESPONSIBLE FOR THE ACCURACY, COMPLETENESS, OR
                RELIABILITY OF DATA OBTAINED FROM QUICKBOOKS ONLINE,
                FIELDROUTES, OR ANY OTHER THIRD-PARTY SOURCE. YOU ACKNOWLEDGE
                THAT INTUIT AND FIELDROUTES ARE INDEPENDENT THIRD PARTIES AND WE
                ARE NOT LIABLE FOR THEIR SERVICES, DATA, OR ACTIONS.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                9. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL ELEVATEPCO, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF
                PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT
                OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED
                ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
              </p>
              <p className="mt-3">
                OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR
                RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE AMOUNT YOU PAID
                US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO
                THE CLAIM.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                10. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless ElevatePCO and
                its officers, directors, employees, and agents from and against
                any claims, damages, losses, liabilities, and expenses
                (including reasonable attorneys&apos; fees) arising out of or
                related to your use of the Service, your violation of this
                Agreement, or your violation of any rights of a third party.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                11. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Service at any
                time, with or without cause, upon notice to you. You may
                terminate your account at any time by contacting us. Upon
                termination, your license to use the Service will immediately
                cease. Sections 6, 8, 9, 10, and 13 shall survive termination
                of this Agreement.
              </p>
              <p className="mt-3">
                Upon termination or disconnection of a third-party integration,
                we will delete your integration data in accordance with our{" "}
                <a
                  href="/privacy"
                  className="text-accent-blue hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                12. Changes to This Agreement
              </h2>
              <p>
                We reserve the right to modify this Agreement at any time. We
                will notify you of material changes by posting the updated
                Agreement on this page and updating the &quot;Effective
                Date.&quot; If changes are significant, we will provide
                additional notice (such as via email). Your continued use of the
                Service after changes constitutes acceptance of the updated
                Agreement.
              </p>
            </div>

            {/* 13 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                13. Governing Law
              </h2>
              <p>
                This Agreement shall be governed by and construed in accordance
                with the laws of the State of Utah, without regard to its
                conflict of law provisions. Any disputes arising under this
                Agreement shall be resolved in the state or federal courts
                located in Utah.
              </p>
            </div>

            {/* 14 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                14. Severability
              </h2>
              <p>
                If any provision of this Agreement is found to be unenforceable
                or invalid, that provision shall be limited or eliminated to the
                minimum extent necessary, and the remaining provisions shall
                remain in full force and effect.
              </p>
            </div>

            {/* 15 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                15. Entire Agreement
              </h2>
              <p>
                This Agreement, together with our Privacy Policy, constitutes
                the entire agreement between you and ElevatePCO regarding the
                Service and supersedes all prior agreements, understandings, and
                communications, whether written or oral.
              </p>
            </div>

            {/* 16 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                16. Contact Us
              </h2>
              <p>
                If you have questions about this Agreement, contact us at:
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
