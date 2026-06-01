import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "ElevatePCO Terms of Use — the terms governing your use of the ElevatePCO platform, including our SMS/text messaging program terms and conditions (A2P 10DLC compliant).",
};

export default function TermsOfUsePage() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Effective Date: June 1, 2026
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
            {/* Introduction */}
            <div>
              <p>
                These Terms of Use (&quot;Terms&quot;) govern your access to and
                use of the ElevatePCO platform, including the website at
                elevatepco.com, our software, dashboards, and related services,
                including any SMS/text messaging programs we operate
                (collectively, the &quot;Service&quot;). ElevatePCO
                (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) provides the
                Service subject to these Terms.
              </p>
              <p className="mt-3">
                By accessing or using the Service, or by providing your consent
                to receive text messages from us, you agree to be bound by these
                Terms and by our{" "}
                <a href="/privacy" className="text-accent-blue hover:underline">
                  Privacy Policy
                </a>
                . If you do not agree, do not access or use the Service.
              </p>
            </div>

            {/* 1 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                1. Eligibility and Accounts
              </h2>
              <p>
                You must be at least 18 years of age and able to form a legally
                binding contract to use the Service. You must provide accurate
                and complete information when creating an account and are
                responsible for maintaining the confidentiality of your account
                credentials and for all activity that occurs under your account.
                Notify us immediately of any unauthorized use.
              </p>
            </div>

            {/* 2 — SMS / A2P */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                2. SMS / Text Messaging Program Terms
              </h2>
              <p className="mb-4">
                These SMS terms apply to ElevatePCO&apos;s text messaging program
                and are provided in accordance with applicable Application-to-Person
                (A2P) messaging requirements, including CTIA guidelines and mobile
                carrier (A2P 10DLC) policies. By providing your mobile phone number
                and opting in, you agree to the terms in this Section 2.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.1 Program Description
              </h3>
              <p className="mb-4">
                When you opt in to the ElevatePCO messaging program, you may
                receive SMS/text messages related to your account and our
                services, such as account and onboarding notifications,
                appointment and service reminders, compliance and operational
                alerts, customer support communications, and (where you have
                separately consented) conversational or informational messages.
                We do not send messages containing content related to sex,
                hate, alcohol, firearms, or tobacco (&quot;SHAFT&quot;).
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.2 Consent and Opt-In
              </h3>
              <p className="mb-4">
                You opt in to receive text messages by submitting your mobile
                phone number through a web form, during account setup, by
                texting a designated keyword to our number, or by otherwise
                expressly providing your number and agreeing to be contacted.
                Consent to receive marketing or promotional text messages is not
                a condition of purchasing any goods or services. Message
                frequency varies based on your account activity and the
                notifications you have enabled.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.3 Message and Data Rates
              </h3>
              <p className="mb-4">
                Message and data rates may apply to each message sent or
                received, depending on your mobile carrier and plan. You are
                responsible for any such charges. ElevatePCO is not responsible
                for charges imposed by your wireless carrier.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.4 Opt-Out (STOP)
              </h3>
              <p className="mb-4">
                You can cancel the SMS program at any time by texting
                <strong> STOP</strong> to the number from which you received our
                messages. After you send <strong>STOP</strong>, we will send a
                one-time confirmation message and will no longer send you SMS
                messages from that program, unless you opt in again. You may
                continue to receive messages for a short period while your
                request is processed.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.5 Help (HELP)
              </h3>
              <p className="mb-4">
                For help or more information about the messaging program, text
                <strong> HELP</strong> to the number from which you received our
                messages, or contact us at{" "}
                <a
                  href="mailto:support@elevatepco.com"
                  className="text-accent-blue hover:underline"
                >
                  support@elevatepco.com
                </a>
                .
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.6 Supported Carriers and Delivery
              </h3>
              <p className="mb-4">
                Supported carriers may change, and we do not guarantee that
                messages will be delivered to your device. Carriers (including,
                but not limited to, T-Mobile, AT&amp;T, and Verizon) are not
                liable for delayed or undelivered messages.
              </p>

              <h3 className="mb-2 font-medium text-text-primary">
                2.7 Privacy of Mobile Information
              </h3>
              <p>
                No mobile information (including your phone number and SMS opt-in
                or consent data) will be shared with or sold to third parties or
                affiliates for their own marketing or promotional purposes. Text
                messaging originator opt-in data and consent are not shared with
                any third parties. See our{" "}
                <a href="/privacy" className="text-accent-blue hover:underline">
                  Privacy Policy
                </a>{" "}
                for full details on how we handle your information.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                3. License to Use the Service
              </h2>
              <p>
                Subject to your compliance with these Terms, we grant you a
                limited, non-exclusive, non-transferable, revocable license to
                access and use the Service for your internal business purposes.
                This license does not include the right to sublicense,
                redistribute, or resell the Service or any part thereof.
              </p>
            </div>

            {/* 4 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                4. Acceptable Use
              </h2>
              <p className="mb-2">You agree not to:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Use the Service for any unlawful, fraudulent, or malicious
                  purpose
                </li>
                <li>
                  Send unsolicited messages or use the Service to violate any
                  applicable messaging, anti-spam, or telemarketing laws
                  (including the TCPA and CAN-SPAM Act)
                </li>
                <li>
                  Reverse engineer, decompile, disassemble, or attempt to derive
                  the source code of the Service
                </li>
                <li>
                  Copy, modify, or create derivative works based on the Service
                </li>
                <li>
                  Rent, lease, lend, sell, sublicense, or transfer access to the
                  Service to any third party
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service or its underlying infrastructure
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service, other user
                  accounts, or related systems or networks
                </li>
                <li>
                  Use the Service to store or transmit malicious code, viruses,
                  or harmful data
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                5. Third-Party Integrations
              </h2>
              <p>
                The Service integrates with third-party platforms, including
                Intuit QuickBooks Online and FieldRoutes. By connecting these
                accounts, you authorize us to access and use the associated data
                solely to provide the Service. Your use of those platforms is
                also subject to their respective terms and privacy policies. We
                are not responsible for the availability, accuracy, or actions of
                third-party services.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                6. Privacy
              </h2>
              <p>
                Your use of the Service is governed by our{" "}
                <a href="/privacy" className="text-accent-blue hover:underline">
                  Privacy Policy
                </a>
                , which describes how we collect, use, store, and protect your
                information, including mobile and SMS opt-in data. You are
                responsible for ensuring you have all necessary rights and
                permissions to share data with us through the Service.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                7. Intellectual Property
              </h2>
              <p>
                The Service, including all software, content, designs,
                trademarks, and documentation, is the exclusive property of
                ElevatePCO or its licensors and is protected by intellectual
                property laws. These Terms do not grant you any ownership rights
                in the Service. You retain ownership of the data you provide to
                or access through the Service.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                8. Fees and Payment
              </h2>
              <p>
                Access to the Service may require payment of fees as described on
                our website or in a separate order form. All fees are
                non-refundable unless otherwise stated. We reserve the right to
                change fees upon reasonable notice. Failure to pay may result in
                suspension or termination of your access.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                9. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS,
                IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE OR ANY
                MESSAGE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR DELIVERED.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                10. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL ELEVATEPCO, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS
                BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE
                OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
                SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS
                PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                11. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless ElevatePCO and
                its officers, directors, employees, and agents from and against
                any claims, damages, losses, liabilities, and expenses
                (including reasonable attorneys&apos; fees) arising out of or
                related to your use of the Service, your messaging activity, your
                violation of these Terms, or your violation of any rights of a
                third party or any applicable law.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                12. Termination
              </h2>
              <p>
                We may suspend or terminate your access to the Service at any
                time, with or without cause, upon notice to you. You may
                terminate your account at any time by contacting us or opt out of
                messaging as described in Section 2.4. Upon termination, your
                license to use the Service will immediately cease. Sections 7, 9,
                10, 11, and 14 shall survive termination.
              </p>
            </div>

            {/* 13 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                13. Changes to These Terms
              </h2>
              <p>
                We may modify these Terms at any time. We will notify you of
                material changes by posting the updated Terms on this page and
                updating the &quot;Effective Date&quot; above. If changes are
                significant, we will provide additional notice. Your continued
                use of the Service after changes constitutes acceptance of the
                updated Terms.
              </p>
            </div>

            {/* 14 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                14. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with
                the laws of the State of Utah, without regard to its conflict of
                law provisions. Any disputes shall be resolved in the state or
                federal courts located in Utah.
              </p>
            </div>

            {/* 15 */}
            <div>
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                15. Contact Us
              </h2>
              <p>
                If you have questions about these Terms or our messaging program,
                contact us at:
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
