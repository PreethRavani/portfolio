import { NextResponse } from "next/server";
import { siteMeta } from "@/lib/data";

const recentSubmissions = new Map<string, number[]>();
const fieldLimits = { name: 100, email: 254, subject: 160, message: 5000 } as const;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

export async function POST(req: Request) {
  try {
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected a JSON request." }, { status: 415 });
    }
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 12_000) {
      return NextResponse.json({ error: "The message is too large." }, { status: 413 });
    }

    const body = await req.text();
    if (body.length > 12_000) {
      return NextResponse.json({ error: "The message is too large." }, { status: 413 });
    }
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "The message could not be read." }, { status: 400 });
    }
    const { name, email, subject = "", message, website = "" } = payload ?? {};

    // Quietly accept honeypot submissions without sending or storing them.
    if (website) return NextResponse.json({ success: true });

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
      !name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    if (typeof subject !== "string" || Object.entries(fieldLimits).some(([field, limit]) => {
      const value = { name, email, subject, message }[field as keyof typeof fieldLimits];
      return typeof value !== "string" || value.trim().length > limit;
    })) {
      return NextResponse.json({ error: "Please check the length of each field and try again." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The contact form is temporarily unavailable. Please email me directly." },
        { status: 503 }
      );
    }

    // Small per-instance throttle; production deployments should also enable
    // provider or edge-level rate limiting to cover multiple server instances.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const recent = (recentSubmissions.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
    if (recent.length >= 5) {
      return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
    }
    if (recentSubmissions.size > 1000) {
      for (const [address, timestamps] of recentSubmissions) {
        if (timestamps.every((time) => now - time >= 60 * 60 * 1000)) recentSubmissions.delete(address);
      }
      if (recentSubmissions.size > 1000) recentSubmissions.delete(recentSubmissions.keys().next().value!);
    }
    recentSubmissions.set(ip, [...recent, now]);

    const safeSubject = (subject.trim() || `New message from ${name}`).replace(/[\r\n]+/g, " ");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Portfolio Inquiries <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL || siteMeta.email],
        reply_to: email,
        subject: `[Portfolio Inquiry] ${safeSubject}`,
        html: `<h2>New portfolio contact form submission</h2>
          <p><strong>Sender:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject.trim() || "N/A")}</p>
          <hr /><p style="white-space: pre-wrap;">${escapeHtml(message.trim())}</p>`,
      }),
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      console.error("Resend delivery failed", response.status);
      return NextResponse.json(
        { error: result?.message || "Email delivery failed. Please email me directly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form request failed", error);
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
