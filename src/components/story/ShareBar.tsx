"use client";
import { useState } from "react";

interface ShareBarProps {
  title: string;
  city: string;
  slug: string;
}

export default function ShareBar({ title, city, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/stories/${slug}`
      : `https://theroamingpostcards.com/stories/${slug}`;

  const shareText = `${title} — ${city} · Stories from the road, by Gargi`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`;
  const instagramCaption = `${shareText}\n\n📍 ${city}\n🔗 ${url}\n\n#TheRoamingPostcards #TravelStories #${city.replace(/\s+/g, "")}`;

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: shareText, url });
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCaption = async () => {
    await navigator.clipboard.writeText(instagramCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2500);
  };

  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android/i.test(navigator.userAgent);

  return (
    <section style={{ borderTop: "1px solid var(--border)" }} className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* label */}
        <p
          className="text-xs tracking-[0.3em] uppercase mb-6 text-center"
          style={{ color: "var(--accent)", fontFamily: "monospace" }}
        >
          Share this story
        </p>

        {/* share text preview */}
        <p
          className="text-center mb-8 italic"
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            fontFamily: "Georgia, serif",
            lineHeight: 1.7,
          }}
        >
          "{shareText}"
        </p>

        {/* buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Mobile: native share */}
          {isMobile && (
            <button
              onClick={handleNativeShare}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                border: "1px solid var(--accent)",
                background: "var(--accent)",
                color: "#0a0a0f",
                borderRadius: 2,
                fontFamily: "monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <ShareIcon /> SHARE
            </button>
          )}

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              border: "1px solid var(--border)",
              background: copied ? "var(--accent)" : "transparent",
              color: copied ? "#0a0a0f" : "var(--text-secondary)",
              borderRadius: 2,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? <CheckIcon /> : <LinkIcon />}
            {copied ? "COPIED!" : "COPY LINK"}
          </button>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-secondary)",
              borderRadius: 2,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
              textDecoration: "none",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--accent)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--border)")
            }
          >
            <WhatsAppIcon /> WHATSAPP
          </a>

          {/* Instagram caption */}
          <button
            onClick={handleCopyCaption}
            title="Copies a ready-to-paste Instagram caption"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              border: "1px solid var(--border)",
              background: captionCopied ? "var(--accent)" : "transparent",
              color: captionCopied ? "#0a0a0f" : "var(--text-secondary)",
              borderRadius: 2,
              fontFamily: "monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {captionCopied ? <CheckIcon /> : <InstagramIcon />}
            {captionCopied ? "CAPTION COPIED!" : "INSTAGRAM"}
          </button>
        </div>

        {/* Instagram hint */}
        {captionCopied && (
          <p
            className="text-center mt-4"
            style={{
              color: "var(--text-muted)",
              fontSize: "0.72rem",
              fontFamily: "monospace",
              letterSpacing: "0.08em",
              opacity: 0.7,
            }}
          >
            Caption copied — paste it into your Instagram post ✦
          </p>
        )}

        {/* decorative postmark line */}
        <div
          className="flex items-center gap-4 mt-10"
          style={{ opacity: 0.15 }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--accent)" }} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle
              cx="9"
              cy="9"
              r="8"
              stroke="var(--accent)"
              strokeWidth="1"
            />
            <circle
              cx="9"
              cy="9"
              r="3"
              stroke="var(--accent)"
              strokeWidth="0.8"
            />
            <line
              x1="9"
              y1="1"
              x2="9"
              y2="17"
              stroke="var(--accent)"
              strokeWidth="0.6"
            />
            <line
              x1="1"
              y1="9"
              x2="17"
              y2="9"
              stroke="var(--accent)"
              strokeWidth="0.6"
            />
          </svg>
          <div style={{ flex: 1, height: 1, background: "var(--accent)" }} />
        </div>
      </div>
    </section>
  );
}

/* ── inline SVG icons ── */
function ShareIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
