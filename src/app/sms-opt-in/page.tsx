import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SmsOptInForm } from "./SmsOptInForm";

export const metadata: Metadata = {
  title: "Text Alert Sign-Up",
  description:
    "Opt in to receive SMS/text alerts from ElevatePCO — account and payment activity, appointment and service reminders, and important updates. Message and data rates may apply.",
};

export default function SmsOptInPage() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Get ElevatePCO Text Alerts
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              Enter your mobile number and opt in below to receive text messages
              from ElevatePCO. We&apos;ll keep you posted on account and payment
              activity, appointment and service reminders, and important
              updates. Your information is never shared with third parties for
              marketing.
            </p>
          </div>

          <div className="mt-10">
            <SmsOptInForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
