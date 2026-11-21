"use client";

import { useId, useState } from "react";
import { formToEnquiry, sendEnquiry, validateEnquiry, type EnquiryErrors } from "@/lib/enquiry";

const inputCls =
  "mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]";

function Field({
  id,
  label,
  required,
  hint,
  error,
  ...input
}: { id: string; label: string; required?: boolean; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {required ? <span className="text-toffee-ink"> *</span> : <span className="font-normal text-cocoa-soft"> (optional)</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputCls}
        required={required}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-cocoa-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Stacked enquiry form used on each puppy's page. */
export function EnquiryForm({ puppyId, defaultMessage }: { puppyId: string; defaultMessage: string }) {
  const uid = useId();
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = formToEnquiry(form);
    const errs = validateEnquiry(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await sendEnquiry(data);
      if (res.ok) setState("sent");
      else {
        setErrors(res.errors ?? {});
        setState("idle");
      }
    } catch {
      setState("failed");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="tp-board">
        <p className="font-plush text-[1.9rem]">Thank you — we got your message!</p>
        <p className="mt-3 text-cocoa-soft">Our team will get back to you shortly. For the quickest reply, message us on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form noValidate className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" required name="name" autoComplete="name" minLength={2} maxLength={80} error={errors.name} />
        <Field
          id={`${uid}-phone`}
          label="Phone or WhatsApp"
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="With country code, e.g. +971 50 123 4567"
          error={errors.phone}
        />
        <Field id={`${uid}-email`} label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field id={`${uid}-area`} label="Your area" name="area" autoComplete="address-level2" maxLength={80} hint="e.g. Dubai Marina" error={errors.area} />
      </div>
      <input type="hidden" name="puppyId" value={puppyId} />
      <div>
        <label htmlFor={`${uid}-msg`} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={`${uid}-msg`}
          name="message"
          rows={4}
          maxLength={2000}
          defaultValue={defaultMessage}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
        />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
        </label>
      </div>
      {state === "failed" ? (
        <p role="alert" className="font-semibold text-[#b3261e]">
          Sorry, that didn’t send. Please try again or message us on WhatsApp.
        </p>
      ) : null}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
