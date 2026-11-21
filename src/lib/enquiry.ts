/** Shared enquiry validation, used by the forms (client) and the API route (server). */
export type Enquiry = {
  name: string;
  phone: string;
  email?: string;
  area?: string;
  message?: string;
  puppyId?: string;
  website?: string; // honeypot: humans never fill this in
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = e.name?.trim() ?? "";
  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > 80) errors.name = "Please keep your name under 80 characters.";

  const phone = e.phone?.trim() ?? "";
  const digits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Please add a phone or WhatsApp number.";
  else if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15)
    errors.phone = "Please add a valid number with country code, e.g. +971 50 123 4567.";

  const email = e.email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "That email doesn't look quite right.";
  if ((e.area?.length ?? 0) > 80) errors.area = "Please keep your area under 80 characters.";
  if ((e.message?.length ?? 0) > 2000) errors.message = "Please keep your message under 2000 characters.";
  return errors;
}

export function formToEnquiry(form: HTMLFormElement): Enquiry {
  const data = new FormData(form);
  const get = (k: string) => (data.get(k) as string | null) ?? "";
  return {
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    area: get("area"),
    message: get("message"),
    puppyId: get("puppyId"),
    website: get("website"),
  };
}

export async function sendEnquiry(e: Enquiry): Promise<{ ok: boolean; errors?: EnquiryErrors }> {
  const res = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e),
  });
  return res.json();
}
