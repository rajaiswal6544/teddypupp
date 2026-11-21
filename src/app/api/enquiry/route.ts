import { NextResponse } from "next/server";
import { validateEnquiry, type Enquiry } from "@/lib/enquiry";

/**
 * Receives puppy enquiries. Validates server-side (never trust the client),
 * silently accepts honeypot submissions, and logs the enquiry.
 * To go live, forward `enquiry` to email / CRM / WhatsApp Business here.
 */
export async function POST(req: Request) {
  let body: Enquiry;
  try {
    body = (await req.json()) as Enquiry;
  } catch {
    return NextResponse.json({ ok: false, errors: { name: "Invalid request." } }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // bot: pretend success

  const errors = validateEnquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const enquiry = {
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email?.trim() || undefined,
    area: body.area?.trim() || undefined,
    message: body.message?.trim().slice(0, 2000) || undefined,
    puppyId: body.puppyId || undefined,
    receivedAt: new Date().toISOString(),
  };
  console.info("[enquiry]", JSON.stringify(enquiry));
  return NextResponse.json({ ok: true });
}
