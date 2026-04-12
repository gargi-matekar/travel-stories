// src/app/api/newsletter/subscribe/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, FROM_NAME } from "@/lib/resend";
import { generateWelcomeEmail } from "@/lib/welcomeEmail";

export async function POST(req: Request) {
  try {
    const { email, source, storySlug } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const normalised = email.toLowerCase().trim();

    // Check duplicate
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalised },
    });

    if (existing) {
      return NextResponse.json(
        { error: "already_subscribed" },
        { status: 409 }
      );
    }

    // Save to DB
    await prisma.subscriber.create({
      data: {
        email: normalised,
        source: source ?? "homepage",
        storySlug: storySlug ?? null,
      },
    });

    // Send welcome email via Resend
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: normalised,
      subject: "✦ You're on the list — TheRoamingPostcards",
      html: generateWelcomeEmail(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter/subscribe]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}