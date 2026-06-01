"use client";

import { useState } from "react";
import Link from "next/link";

export function SmsOptInForm() {
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = phone.trim().length >= 10 && consent;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border-custom bg-bg-secondary p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-emerald/15">
          <svg
            className="h-6 w-6 text-accent-emerald"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-text-primary">
          You&apos;re signed up!
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Thanks for subscribing. We&apos;ll text a confirmation to{" "}
          <span className="font-medium text-text-primary">{phone}</span>. Reply{" "}
          <strong>STOP</strong> at any time to cancel or <strong>HELP</strong>{" "}
          for help.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border-custom bg-bg-secondary p-6 sm:p-8"
    >
      <h2 className="text-center text-lg font-semibold text-text-primary">
        ElevatePCO Text Alert Sign-Up
      </h2>

      {/* Phone number input */}
      <div className="mt-6">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-text-primary"
        >
          Mobile Phone Number<span className="text-accent-blue">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="(555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border-custom bg-bg-tertiary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      {/* Consent checkbox — NOT pre-checked */}
      <div className="mt-5 flex gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border-custom bg-bg-tertiary text-accent-blue focus:ring-1 focus:ring-accent-blue"
        />
        <label
          htmlFor="consent"
          className="cursor-pointer text-sm leading-relaxed text-text-secondary"
        >
          Yes, I would like to receive automated text messages from ElevatePCO
          about account and payment activity, appointment and service reminders,
          and important account updates. I understand I will receive up to 6
          messages per month.
        </label>
      </div>

      {/* Disclosures */}
      <div className="mt-5 space-y-2 text-sm leading-relaxed text-text-secondary">
        <p>
          <strong className="text-text-primary">Message Frequency:</strong> You
          will receive up to 6 messages per month.
        </p>
        <p>
          <strong className="text-text-primary">Standard Rates:</strong> Message
          and data rates may apply depending on your mobile phone service plan.
        </p>
        <p>
          <strong className="text-text-primary">Help &amp; Stop:</strong> Reply{" "}
          <strong>HELP</strong> for help or <strong>STOP</strong> to cancel at
          any time. By providing your phone number and checking the box above,
          you agree to receive text messages from ElevatePCO. Consent is not
          required to make a purchase.
        </p>
      </div>

      {/* Legal links */}
      <p className="mt-5 text-sm text-text-secondary">
        <Link href="/terms" className="text-accent-blue hover:underline">
          Terms of Use
        </Link>{" "}
        |{" "}
        <Link href="/privacy" className="text-accent-blue hover:underline">
          Privacy Policy
        </Link>
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full rounded-lg bg-accent-blue px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent-blue/20 transition-all duration-200 hover:bg-accent-blue-hover hover:shadow-accent-blue/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        Yes, sign me up!
      </button>
    </form>
  );
}
