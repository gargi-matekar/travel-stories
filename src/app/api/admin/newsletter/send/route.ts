// src/app/api/admin/newsletter/send/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, FROM_EMAIL, FROM_NAME } from "@/lib/resend";
import { generateTravelogueEmail, TravelogueData } from "@/lib/emailTemplate";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const required = [
      "issueNumber", "month", "word", "pronunciation",
      "language", "definition", "gargiStory", "location",
      "mapNote", "song", "pairWith", "question",
      "storyUrl", "storyCity", "closingLine",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    const data: TravelogueData = body;
    const html = generateTravelogueEmail(data);

    // Get all subscribers
    const subscribers = await prisma.subscriber.findMany({
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, message: "No subscribers yet." });
    }

    // Resend supports batch sending up to 100 at a time
    const BATCH = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      try {
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: batch.map((s) => s.email),
          subject: `✦ ${data.word} — TheRoamingPostcards Dispatch ${String(data.issueNumber).padStart(3, "0")}`,
          html,
        });
        sent += batch.length;
      } catch (batchErr) {
        console.error(`Batch ${i}-${i + BATCH} failed:`, batchErr);
        failed += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (err) {
    console.error("[admin/newsletter/send]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}