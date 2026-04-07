// src/app/stories/[slug]/page.tsx
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CitySongSection from "@/components/SongPlayer";
import CityQuestionSection from "@/components/QuestionHighlight";
import JourneyRouteMap from "@/components/JourneyRouteMap";
import CityFramesSection from "@/components/story/CityFramesSection";
import LocalRecommendationsSection from "@/components/LocalRecommendations";
import PhotoMemoriesSection from "@/components/story/PhotoMemoriesSection";
import JourneyTimeline from "@/components/JourneyTimeline";
import PartOfATripSection from "@/components/story/PartOfATripSection";
import ClosingReflection from "@/components/story/ClosingReflection";
import StoryContent from "@/components/StoryContent";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({ select: { slug: true } });
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: Props) {
  const story = await prisma.story.findUnique({
    where: { slug: params.slug },
    include: {
      trip: true,
      cityFrames: { orderBy: { order: "asc" } },
      routeStops: { orderBy: { order: "asc" } },
      recommendations: true,
      photoMemories: { orderBy: { order: "asc" } },
      journeySteps: { orderBy: { order: "asc" } },
      // NOTE: expenses intentionally excluded — shown on Trip page only
    },
  });

  if (!story) notFound();

  return (
    <main style={{ background: "transparent", color: "var(--text-primary)" }}>
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight: "100vh",
          overflow: "hidden",
          background: "#030305",
          padding: "32px 0",
        }}
      >
        <style>{`
  @keyframes cardIn {
    from { opacity:0; transform:translateY(20px) scale(0.96); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes stampIn {
    from { opacity:0; transform:rotate(-3deg) scale(0.88) translateY(-12px); }
    to   { opacity:1; transform:rotate(-3deg) scale(1) translateY(0); }
  }
  @keyframes sealIn {
    0%   { opacity:0; transform:scale(1.4) rotate(14deg); }
    60%  { opacity:1; transform:scale(0.95) rotate(-1deg); }
    100% { opacity:1; transform:scale(1) rotate(0deg); }
  }
  @keyframes heroFadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .pc-card-in  { animation: cardIn     0.75s ease both; }
  .pc-stamp-in { animation: stampIn    0.8s 0.25s cubic-bezier(0.34,1.3,0.64,1) both; }
  .pc-seal-in  { animation: sealIn     0.6s 1s   cubic-bezier(0.34,1.2,0.64,1) both; }
  .pc-fade-1   { animation: heroFadeUp 0.5s 0.2s  ease both; }
  .pc-fade-2   { animation: heroFadeUp 0.6s 0.5s  ease both; }
  .pc-fade-3   { animation: heroFadeUp 0.6s 0.65s ease both; }
  .pc-fade-4   { animation: heroFadeUp 0.5s 0.7s  ease both; }
`}</style>

        {/* scattered bg passport stamps */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.04,
            pointerEvents: "none",
          }}
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect
            x="40"
            y="40"
            width="110"
            height="56"
            rx="3"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.5"
            transform="rotate(-6,95,68)"
          />
          <text
            x="95"
            y="62"
            textAnchor="middle"
            fontSize="8"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(-6,95,68)"
          >
            DEPARTURE
          </text>
          <text
            x="95"
            y="74"
            textAnchor="middle"
            fontSize="7"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(-6,95,68)"
          >
            INDIA
          </text>
          <rect
            x="1240"
            y="780"
            width="110"
            height="56"
            rx="3"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.5"
            transform="rotate(5,1295,808)"
          />
          <text
            x="1295"
            y="802"
            textAnchor="middle"
            fontSize="8"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(5,1295,808)"
          >
            ARRIVAL
          </text>
          <circle
            cx="1260"
            cy="120"
            r="52"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.2"
            transform="rotate(8,1260,120)"
          />
          <line
            x1="1208"
            y1="120"
            x2="1312"
            y2="120"
            stroke="#c8a96e"
            strokeWidth="3"
            transform="rotate(8,1260,120)"
          />
          <text
            x="1260"
            y="112"
            textAnchor="middle"
            fontSize="8"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(8,1260,120)"
          >
            CLASSIFIED
          </text>
          <rect
            x="600"
            y="800"
            width="120"
            height="54"
            rx="3"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.5"
            transform="rotate(-3,660,827)"
          />
          <text
            x="660"
            y="822"
            textAnchor="middle"
            fontSize="8"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(-3,660,827)"
          >
            VISA GRANTED
          </text>
          <text
            x="660"
            y="836"
            textAnchor="middle"
            fontSize="7"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(-3,660,827)"
          >
            INDIA · 2026
          </text>
          <rect
            x="60"
            y="780"
            width="100"
            height="50"
            rx="3"
            fill="none"
            stroke="#c8a96e"
            strokeWidth="1.5"
            transform="rotate(4,110,805)"
          />
          <text
            x="110"
            y="800"
            textAnchor="middle"
            fontSize="7"
            fill="#c8a96e"
            fontFamily="monospace"
            transform="rotate(4,110,805)"
          >
            TRANSIT
          </text>
        </svg>

        {/* outer glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,rgba(200,169,110,0.04),transparent 40%,transparent 60%,rgba(200,169,110,0.02))",
          }}
        />

        <div className="relative z-10 w-full px-6" style={{ maxWidth: "96vw" }}>
          {/* ── THE POSTCARD ── */}
          <div
            className="pc-card-in relative flex"
            style={{ background: "#0a0a0f" }}
          >
            {/* diagonal stripe borders */}
            <div
              style={{
                position: "absolute",
                top: -13,
                left: -13,
                right: -13,
                height: 13,
                background:
                  "repeating-linear-gradient(45deg,#1a1408 0,#1a1408 8px,#c8a96e 8px,#c8a96e 9px,#1a1408 9px,#1a1408 18px)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -13,
                left: -13,
                right: -13,
                height: 13,
                background:
                  "repeating-linear-gradient(45deg,#1a1408 0,#1a1408 8px,#c8a96e 8px,#c8a96e 9px,#1a1408 9px,#1a1408 18px)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -13,
                left: -13,
                bottom: -13,
                width: 13,
                background:
                  "repeating-linear-gradient(135deg,#1a1408 0,#1a1408 8px,#c8a96e 8px,#c8a96e 9px,#1a1408 9px,#1a1408 18px)",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -13,
                right: -13,
                bottom: -13,
                width: 13,
                background:
                  "repeating-linear-gradient(135deg,#1a1408 0,#1a1408 8px,#c8a96e 8px,#c8a96e 9px,#1a1408 9px,#1a1408 18px)",
                opacity: 0.9,
              }}
            />

            {/* ── LEFT: stamp side ── */}
            <div
              style={{
                flex: "1.05",
                padding: "32px 24px 28px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
                position: "relative",
              }}
            >
              <div
                className="pc-fade-1"
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 12,
                  fontStyle: "italic",
                  color: "rgba(200,169,110,0.32)",
                  letterSpacing: "0.08em",
                }}
              >
                Post Card
              </div>

              {/* perforated stamp */}
              <div
                className="pc-stamp-in"
                style={{ position: "relative", alignSelf: "flex-start" }}
              >
                {/* perforations */}
                <svg
                  width="340"
                  height="300"
                  viewBox="0 0 340 300"
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -8,
                    pointerEvents: "none",
                  }}
                >
                  <g fill="#0a0a0f">
                    {[
                      10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164, 178,
                      192, 206, 220, 234, 248, 262, 276, 290, 304, 318, 332,
                    ].map((x, i) => (
                      <g key={i}>
                        <circle cx={x} cy="4" r="4.5" />
                        <circle cx={x} cy="296" r="4.5" />
                      </g>
                    ))}
                    {[
                      14, 28, 42, 56, 70, 84, 98, 112, 126, 140, 154, 168, 182,
                      196, 210, 224, 238, 252, 266, 280,
                    ].map((y, i) => (
                      <g key={i}>
                        <circle cx="4" cy={y} r="4.5" />
                        <circle cx="336" cy={y} r="4.5" />
                      </g>
                    ))}
                  </g>
                </svg>

                {/* stamp body */}
                <div
                  style={{
                    width: "min(460px, 42vw)",
                    aspectRatio: "324/284",
                    border: "2px solid #c8a96e",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    background: "#0d0d14",
                    position: "relative",
                  }}
                >
                  {/* image */}
                  <div
                    style={{
                      flex: 1,
                      position: "relative",
                      overflow: "hidden",
                      background: "#0a1520",
                    }}
                  >
                    {story.coverImage && (
                      <img
                        src={story.coverImage}
                        alt={story.city}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom,transparent 55%,rgba(0,0,0,0.6))",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 6,
                        border: "0.5px solid rgba(200,169,110,0.12)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 9,
                        left: 11,
                        fontSize: 7,
                        color: "rgba(200,169,110,0.4)",
                        fontFamily: "monospace",
                      }}
                    >
                      {story.country?.toUpperCase()}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 9,
                        right: 11,
                        fontSize: 7,
                        color: "rgba(200,169,110,0.4)",
                        fontFamily: "monospace",
                      }}
                    >
                      2026
                    </div>
                  </div>
                  {/* footer */}
                  <div
                    style={{
                      padding: "7px 5px 4px",
                      textAlign: "center",
                      borderTop: "0.5px solid rgba(200,169,110,0.2)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: "#c8a96e",
                        letterSpacing: "0.22em",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {story.city}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 3,
                        padding: "0 3px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 7,
                          color: "#5a4018",
                          fontFamily: "monospace",
                        }}
                      >
                        BHARAT
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "#7a6030",
                          fontFamily: "monospace",
                        }}
                      >
                        ₹ 25
                      </div>
                    </div>
                  </div>
                  {/* postmark inside stamp */}
                  <svg
                    style={{
                      position: "absolute",
                      top: -40,
                      right: -45,
                      opacity: 0.18,
                    }}
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#c8a96e"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="42"
                      fill="none"
                      stroke="#c8a96e"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="6"
                      y1="60"
                      x2="114"
                      y2="60"
                      stroke="#c8a96e"
                      strokeWidth="2.5"
                    />
                    <line
                      x1="6"
                      y1="54"
                      x2="114"
                      y2="54"
                      stroke="#c8a96e"
                      strokeWidth="0.7"
                    />
                    <line
                      x1="6"
                      y1="66"
                      x2="114"
                      y2="66"
                      stroke="#c8a96e"
                      strokeWidth="0.7"
                    />
                    <path
                      id="ipm"
                      d="M 9,60 A 51,51 0 0,1 111,60"
                      fill="none"
                    />
                    <path
                      id="ipm2"
                      d="M 11,70 A 49,49 0 0,0 109,70"
                      fill="none"
                    />
                    <text
                      fontSize="9"
                      fill="#c8a96e"
                      fontFamily="monospace"
                      letterSpacing="1.5"
                    >
                      <textPath href="#ipm" startOffset="8%">
                        {story.city.toUpperCase()}
                      </textPath>
                    </text>
                    <text
                      fontSize="8"
                      fill="#c8a96e"
                      fontFamily="monospace"
                      letterSpacing="1.2"
                    >
                      <textPath href="#ipm2" startOffset="20%">
                        JAN · 2026
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <div
                className="pc-fade-4"
                style={{
                  fontFamily: "Georgia,serif",
                  fontSize: 11,
                  fontStyle: "italic",
                  color: "rgba(200,169,110,0.25)",
                  letterSpacing: "0.05em",
                }}
              >
                From {story.city}, with stories
              </div>
            </div>

            {/* dotted vertical divider */}
            <div
              style={{
                width: 1,
                background:
                  "repeating-linear-gradient(to bottom,rgba(200,169,110,0.3) 0,rgba(200,169,110,0.3) 5px,transparent 5px,transparent 11px)",
                margin: "24px 0",
                flexShrink: 0,
              }}
            />

            {/* ── RIGHT: content ── */}
            <div
              style={{
                flex: 1,
                padding: "32px 32px 28px 26px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {/* surveyor seal — top right */}
              <div
                className="pc-seal-in"
                style={{ position: "absolute", top: 6, right: 8, zIndex: 10 }}
              >
                <svg width="92" height="92" viewBox="0 0 92 92">
                  <circle
                    cx="46"
                    cy="46"
                    r="43"
                    fill="#0a0a0f"
                    stroke="#c8a96e"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="46"
                    cy="46"
                    r="37"
                    fill="none"
                    stroke="#c8a96e"
                    strokeWidth="0.5"
                    opacity="0.22"
                  />
                  <line
                    x1="46"
                    y1="7"
                    x2="46"
                    y2="85"
                    stroke="#c8a96e"
                    strokeWidth="0.4"
                    opacity="0.16"
                  />
                  <line
                    x1="7"
                    y1="46"
                    x2="85"
                    y2="46"
                    stroke="#c8a96e"
                    strokeWidth="0.4"
                    opacity="0.16"
                  />
                  <line
                    x1="46"
                    y1="4"
                    x2="46"
                    y2="14"
                    stroke="#c8a96e"
                    strokeWidth="1.1"
                    opacity="0.55"
                  />
                  <line
                    x1="46"
                    y1="78"
                    x2="46"
                    y2="88"
                    stroke="#c8a96e"
                    strokeWidth="1.1"
                    opacity="0.55"
                  />
                  <line
                    x1="4"
                    y1="46"
                    x2="14"
                    y2="46"
                    stroke="#c8a96e"
                    strokeWidth="1.1"
                    opacity="0.55"
                  />
                  <line
                    x1="78"
                    y1="46"
                    x2="88"
                    y2="46"
                    stroke="#c8a96e"
                    strokeWidth="1.1"
                    opacity="0.55"
                  />
                  <line
                    x1="16"
                    y1="16"
                    x2="22"
                    y2="22"
                    stroke="#c8a96e"
                    strokeWidth="0.7"
                    opacity="0.25"
                  />
                  <line
                    x1="76"
                    y1="16"
                    x2="70"
                    y2="22"
                    stroke="#c8a96e"
                    strokeWidth="0.7"
                    opacity="0.25"
                  />
                  <line
                    x1="16"
                    y1="76"
                    x2="22"
                    y2="70"
                    stroke="#c8a96e"
                    strokeWidth="0.7"
                    opacity="0.25"
                  />
                  <line
                    x1="76"
                    y1="76"
                    x2="70"
                    y2="70"
                    stroke="#c8a96e"
                    strokeWidth="0.7"
                    opacity="0.25"
                  />
                  <circle
                    cx="46"
                    cy="46"
                    r="11"
                    fill="none"
                    stroke="#c8a96e"
                    strokeWidth="0.6"
                    opacity="0.26"
                  />
                  <circle
                    cx="46"
                    cy="46"
                    r="3.2"
                    fill="none"
                    stroke="#c8a96e"
                    strokeWidth="1"
                    opacity="0.55"
                  />
                  <circle
                    cx="46"
                    cy="46"
                    r="1.1"
                    fill="#c8a96e"
                    opacity="0.72"
                  />
                  <text
                    x="46"
                    y="33"
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="#c8a96e"
                    fontFamily="monospace"
                    letterSpacing="2.5"
                    opacity="0.82"
                  >
                    GARGI
                  </text>
                  {story.coordinates && (
                    <text
                      x="46"
                      y="62"
                      textAnchor="middle"
                      fontSize="4.8"
                      fill="#c8a96e"
                      fontFamily="monospace"
                      letterSpacing="0.5"
                      opacity="0.32"
                    >
                      {story.coordinates}
                    </text>
                  )}
                  <path
                    id="seal-arc"
                    d="M 16,52 A 32,32 0 0,0 76,52"
                    fill="none"
                  />
                  <text
                    fontSize="5"
                    fill="#c8a96e"
                    fontFamily="monospace"
                    letterSpacing="1.5"
                    opacity="0.22"
                  >
                    <textPath href="#seal-arc" startOffset="10%">
                      {story.country?.toUpperCase()} · 2026
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* top: label + city + subtitle */}
              <div className="pc-fade-2">
                <div
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.32em",
                    color: "rgba(200,169,110,0.38)",
                    fontFamily: "monospace",
                    marginBottom: 16,
                    textTransform: "uppercase",
                  }}
                >
                  Roaming Postcards
                </div>
                <h1
                  style={{
                    fontFamily: "Georgia,serif",
                    fontSize: "clamp(32px,4.5vw,58px)",
                    fontWeight: 500,
                    color: "#f0e8d8",
                    lineHeight: 1.0,
                    marginBottom: 14,
                  }}
                >
                  {story.city}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      height: 1,
                      width: 16,
                      background: "#c8a96e",
                      opacity: 0.4,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: "monospace",
                      color: "#7a5a30",
                      letterSpacing: "0.14em",
                    }}
                  >
                    {[story.state, story.country]
                      .filter(Boolean)
                      .join(" · ")
                      .toUpperCase()}
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "Georgia,serif",
                    fontStyle: "italic",
                    fontSize: "clamp(0.9rem,1.5vw,1.1rem)",
                    color: "#9a7850",
                    lineHeight: 1.7,
                    maxWidth: 320,
                  }}
                >
                  {story.title}
                </p>
              </div>

              {/* bottom: address lines + coordinates */}
              <div className="pc-fade-3">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.68),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.64),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.60),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.50),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.40),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.30),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.20),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.10),transparent)",
                    }}
                  />
                  <div
                    style={{
                      height: 2,
                      background:
                        "linear-gradient(to right,rgba(200,169,110,0.1),transparent)",
                    }}
                  />
                </div>
                {story.coordinates && (
                  <div
                    style={{
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "rgba(200,169,110,0.25)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {story.coordinates}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SONG OF THE CITY ─────────────────────────────────── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {story.songName && story.songEmbedUrl && (
            <CitySongSection
              songName={story.songName}
              songEmbedUrl={story.songEmbedUrl}
            />
          )}
        </div>
      </section>

      {/* ── 3. QUESTION ─────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          {story.questionAsked && (
            <CityQuestionSection question={story.questionAsked} />
          )}
        </div>
      </section>

      {/* ── 4. STORY NARRATIVE ──────────────────────────────────── */}
      {story.content && (
        <section
          className="py-20"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <StoryContent content={story.content} />
          </div>
        </section>
      )}

      {/* ── 5. JOURNEY ROUTE MAP ────────────────────────────────── */}
      {story.routeStops.length > 0 && (
        <section
          className="py-20"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-4xl mx-auto px-6">
            <p
              className="text-sm tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--accent)" }}
            >
              The Walk
            </p>
            <h2
              className="text-3xl font-bold mb-8"
              style={{
                color: "var(--text-primary)",
                fontFamily: "Georgia, serif",
              }}
            >
              Journey Route
            </h2>
            <JourneyRouteMap stops={story.routeStops} />
          </div>
        </section>
      )}

      {/* ── 6. CITY IN 5 FRAMES ─────────────────────────────────── */}
      {story.cityFrames.length > 0 && (
        <CityFramesSection frames={story.cityFrames} city={story.city} />
      )}

      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* ── 7. PLACES I LOVED ───────────────────────────────────── */}
          {story.recommendations.length > 0 && (
            <LocalRecommendationsSection
              recommendations={story.recommendations}
            />
          )}
        </div>
      </section>

      {/* ── 8. PHOTO MEMORIES ───────────────────────────────────── */}
      {story.photoMemories.length > 0 && (
        <PhotoMemoriesSection memories={story.photoMemories} />
      )}

      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* ── 9. JOURNEY TIMELINE ─────────────────────────────────── */}
          {story.journeySteps.length > 0 && (
            <JourneyTimeline steps={story.journeySteps} />
          )}
        </div>
      </section>

      {/* ── 10. PART OF A LARGER TRIP ───────────────────────────── */}
      {story.trip && <PartOfATripSection trip={story.trip} />}

      {/* ── 11. CLOSING REFLECTION ──────────────────────────────── */}
      {story.closingReflection && (
        <ClosingReflection
          reflection={story.closingReflection}
          city={story.city}
        />
      )}
    </main>
  );
}
