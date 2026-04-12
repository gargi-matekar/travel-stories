// src/lib/emailTemplate.ts
// The Travelogue — monthly dispatch template for TheRoamingPostcards
// Used with Resend: pass word data + story data to generate HTML

export interface TravelogueData {
  issueNumber: number;
  month: string;       // e.g. "April 2026"
  word: string;        // e.g. "Mamihlapinatapai"
  pronunciation: string;
  language: string;    // e.g. "Yagán · Indigenous Patagonian"
  definition: string;
  gargiStory: string;  // Gargi's personal paragraph about where she felt it
  location: string;    // e.g. "Pondicherry · Tamil Nadu · 5:42am"
  mapNote: string;     // "On the map" cell
  song: string;        // "Song for this" cell
  pairWith: string;    // "Pair with" cell
  question: string;    // Monthly reader question
  storyUrl: string;    // CTA link
  storyCity: string;   // For CTA sub-label
  closingLine: string; // Sign-off sentence
  // Temple illustration city name label (top of SVG)
  templeCity?: string;
  templeCoords?: string;
}

export function generateTravelogueEmail(data: TravelogueData): string {
  const {
    issueNumber,
    month,
    word,
    pronunciation,
    language,
    definition,
    gargiStory,
    location,
    mapNote,
    song,
    pairWith,
    question,
    storyUrl,
    storyCity,
    closingLine,
    templeCity = "Meenakshi Amman",
    templeCoords = "Madurai · Tamil Nadu",
  } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>TheRoamingPostcards · Dispatch ${issueNumber}</title>
<style>
  body{margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;-webkit-font-smoothing:antialiased}
  img{border:0;display:block}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:560px;margin:0 auto;padding:20px 12px}
  @media(max-width:600px){
    .triples-table{display:block!important}
    .triple-cell{display:block!important;width:100%!important;border-right:none!important;border-bottom:1px solid #e8dcc8!important}
    .triple-cell:last-child{border-bottom:none!important}
  }
</style>
</head>
<body>
<div class="wrap">

<!-- Pre-header -->
<div style="text-align:center;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8a6a;font-family:monospace;margin-bottom:16px">
  ✦ TheRoamingPostcards · A dispatch from the road
</div>

<!-- Header -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0f0a;border-collapse:collapse">
  <tr>
    <td style="padding:18px 28px;font-family:Georgia,serif;font-size:15px;color:#c8a96e;letter-spacing:0.06em">
      ✦ TheRoamingPostcards
    </td>
    <td style="padding:18px 28px;text-align:right">
      <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#7a6040;font-family:monospace">Issue No. ${String(issueNumber).padStart(3, "0")}</div>
      <div style="font-size:10px;color:#9a7850;font-family:monospace;margin-top:2px">${month}</div>
    </td>
  </tr>
</table>

<!-- Temple Header Image — PNG served from API route, works in all email clients -->
<div style="background:#1a0f0a;border-bottom:3px solid #c8a96e;line-height:0">
<img src="data:image/png;base64,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" width="560" height="220" alt="TheRoamingPostcards Temple" style="display:block;width:100%;max-width:560px;border:0"/>
<!--[if !mso]><!-- gmail fallback SVG removed — PNG always loads --><!--<![endif]-->
<div style="display:none">
<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:560px">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0520"/>
      <stop offset="60%" stop-color="#1a0a2e"/>
      <stop offset="100%" stop-color="#2d1040"/>
    </linearGradient>
    <linearGradient id="stonegold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c8a96e"/>
      <stop offset="100%" stop-color="#7a5a30"/>
    </linearGradient>
    <linearGradient id="stonedark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5a3820"/>
      <stop offset="100%" stop-color="#2d1810"/>
    </linearGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffacc" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#fffacc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff9900" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#ff9900" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="560" height="220" fill="url(#sky)"/>
  <!-- Stars -->
  <circle cx="42" cy="18" r="0.8" fill="#fff" opacity="0.7"/>
  <circle cx="98" cy="12" r="0.6" fill="#fff" opacity="0.5"/>
  <circle cx="155" cy="22" r="1" fill="#fff" opacity="0.8"/>
  <circle cx="210" cy="8" r="0.7" fill="#fff" opacity="0.6"/>
  <circle cx="320" cy="15" r="0.8" fill="#fff" opacity="0.7"/>
  <circle cx="380" cy="9" r="0.6" fill="#fff" opacity="0.5"/>
  <circle cx="440" cy="20" r="0.9" fill="#fff" opacity="0.7"/>
  <circle cx="500" cy="11" r="0.7" fill="#fff" opacity="0.6"/>
  <circle cx="70" cy="35" r="0.6" fill="#fff" opacity="0.4"/>
  <circle cx="290" cy="30" r="0.7" fill="#fff" opacity="0.5"/>
  <!-- Moon -->
  <circle cx="460" cy="30" r="16" fill="url(#moonGlow)"/>
  <circle cx="460" cy="30" r="11" fill="#fffacc" opacity="0.9"/>
  <circle cx="466" cy="26" r="9" fill="#1a0a2e"/>
  <!-- Water -->
  <rect x="0" y="175" width="560" height="45" fill="#0d0520" opacity="0.8"/>
  <rect x="0" y="178" width="560" height="2" fill="#c8a96e" opacity="0.1"/>
  <rect x="60" y="185" width="40" height="1.5" rx="1" fill="#c8a96e" opacity="0.15"/>
  <rect x="200" y="190" width="60" height="1" rx="0.5" fill="#ff9900" opacity="0.18"/>
  <rect x="380" y="187" width="50" height="1.5" rx="1" fill="#c8a96e" opacity="0.12"/>
  <!-- Main Gopuram -->
  <rect x="160" y="160" width="110" height="15" fill="url(#stonedark)"/>
  <rect x="165" y="158" width="100" height="4" fill="url(#stonegold)" opacity="0.6"/>
  <rect x="178" y="90" width="74" height="70" fill="url(#stonedark)"/>
  <rect x="174" y="84" width="82" height="10" fill="url(#stonegold)" opacity="0.8"/>
  <rect x="178" y="76" width="74" height="10" fill="url(#stonedark)"/>
  <rect x="181" y="70" width="68" height="8" fill="url(#stonegold)" opacity="0.75"/>
  <rect x="185" y="62" width="60" height="10" fill="url(#stonedark)"/>
  <rect x="188" y="56" width="54" height="8" fill="url(#stonegold)" opacity="0.7"/>
  <rect x="192" y="48" width="46" height="10" fill="url(#stonedark)"/>
  <rect x="195" y="42" width="40" height="8" fill="url(#stonegold)" opacity="0.65"/>
  <rect x="199" y="35" width="32" height="9" fill="url(#stonedark)"/>
  <rect x="202" y="29" width="26" height="7" fill="url(#stonegold)" opacity="0.6"/>
  <rect x="206" y="22" width="18" height="9" fill="url(#stonedark)"/>
  <ellipse cx="215" cy="20" rx="7" ry="5" fill="#c8a96e" opacity="0.9"/>
  <circle cx="215" cy="16" r="3" fill="#ffaa00"/>
  <line x1="215" y1="8" x2="215" y2="16" stroke="#c8a96e" stroke-width="1.5"/>
  <!-- Figures on main tier -->
  <rect x="183" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <rect x="191" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <rect x="199" y="87" width="4" height="6" rx="1" fill="#ffaa00" opacity="0.7"/>
  <rect x="207" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <rect x="215" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <rect x="223" y="87" width="4" height="6" rx="1" fill="#ffaa00" opacity="0.7"/>
  <rect x="231" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <rect x="239" y="87" width="4" height="6" rx="1" fill="#ff6b1a" opacity="0.7"/>
  <!-- Lamp glow + diyas -->
  <ellipse cx="215" cy="162" rx="30" ry="12" fill="url(#lampGlow)"/>
  <ellipse cx="185" cy="163" rx="4" ry="2" fill="#cc4400" opacity="0.8"/>
  <ellipse cx="185" cy="163" rx="2" ry="1" fill="#ffaa00"/>
  <ellipse cx="215" cy="163" rx="4" ry="2" fill="#cc4400" opacity="0.8"/>
  <ellipse cx="215" cy="163" rx="2" ry="1" fill="#ffaa00"/>
  <ellipse cx="245" cy="163" rx="4" ry="2" fill="#cc4400" opacity="0.8"/>
  <ellipse cx="245" cy="163" rx="2" ry="1" fill="#ffaa00"/>
  <ellipse cx="185" cy="161" rx="1.5" ry="2.5" fill="#ffcc00" opacity="0.9"/>
  <ellipse cx="215" cy="161" rx="1.5" ry="2.5" fill="#ffcc00" opacity="0.9"/>
  <ellipse cx="245" cy="161" rx="1.5" ry="2.5" fill="#ffcc00" opacity="0.9"/>
  <!-- Marigold garland -->
  <path d="M 170,165 Q 195,158 215,162 Q 235,158 260,165" fill="none" stroke="#ff8c00" stroke-width="2" opacity="0.5"/>
  <!-- Second Gopuram -->
  <rect x="340" y="140" width="80" height="35" fill="url(#stonedark)"/>
  <rect x="336" y="134" width="88" height="9" fill="url(#stonegold)" opacity="0.75"/>
  <rect x="340" y="126" width="80" height="10" fill="url(#stonedark)"/>
  <rect x="344" y="120" width="72" height="8" fill="url(#stonegold)" opacity="0.7"/>
  <rect x="348" y="113" width="64" height="9" fill="url(#stonedark)"/>
  <rect x="352" y="107" width="56" height="8" fill="url(#stonegold)" opacity="0.65"/>
  <rect x="356" y="100" width="48" height="9" fill="url(#stonedark)"/>
  <rect x="360" y="94" width="40" height="8" fill="url(#stonegold)" opacity="0.6"/>
  <rect x="364" y="88" width="32" height="8" fill="url(#stonedark)"/>
  <rect x="368" y="83" width="24" height="7" fill="url(#stonegold)" opacity="0.55"/>
  <ellipse cx="380" cy="82" rx="6" ry="4" fill="#c8a96e" opacity="0.85"/>
  <circle cx="380" cy="78" r="2.5" fill="#ffaa00"/>
  <line x1="380" y1="72" x2="380" y2="78" stroke="#c8a96e" stroke-width="1.2"/>
  <ellipse cx="355" cy="176" rx="3" ry="1.5" fill="#cc4400" opacity="0.7"/>
  <ellipse cx="380" cy="176" rx="3" ry="1.5" fill="#cc4400" opacity="0.7"/>
  <ellipse cx="405" cy="176" rx="3" ry="1.5" fill="#cc4400" opacity="0.7"/>
  <ellipse cx="355" cy="174" rx="1.2" ry="2" fill="#ffcc00" opacity="0.8"/>
  <ellipse cx="380" cy="174" rx="1.2" ry="2" fill="#ffcc00" opacity="0.8"/>
  <ellipse cx="405" cy="174" rx="1.2" ry="2" fill="#ffcc00" opacity="0.8"/>
  <!-- Connecting wall -->
  <rect x="270" y="155" width="70" height="20" fill="url(#stonedark)" opacity="0.9"/>
  <rect x="270" y="153" width="70" height="4" fill="url(#stonegold)" opacity="0.5"/>
  <!-- Orange glow halos -->
  <ellipse cx="215" cy="165" rx="90" ry="35" fill="#ff4400" opacity="0.07"/>
  <ellipse cx="380" cy="160" rx="70" ry="28" fill="#ff6600" opacity="0.06"/>
  <path d="M 335,165 Q 360,158 380,162 Q 400,158 425,165" fill="none" stroke="#ff8c00" stroke-width="1.5" opacity="0.4"/>
  <!-- City labels -->
  <text x="280" y="108" text-anchor="middle" font-size="9" fill="#c8a96e" font-family="monospace" letter-spacing="3" opacity="0.7">${templeCity.toUpperCase()}</text>
  <text x="280" y="121" text-anchor="middle" font-size="8" fill="#9a7850" font-family="monospace" letter-spacing="2" opacity="0.55">${templeCoords.toUpperCase()}</text>
</svg>
</div>
</div>

<!-- Word Section -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;border-collapse:collapse">
  <tr><td style="padding:32px 32px 28px;border-bottom:1px solid #e8dcc8">
    <div style="font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:#9a7850;font-family:monospace;margin-bottom:16px">
      TheRoamingPostcards · Issue ${String(issueNumber).padStart(3, "0")} · ${month}
    </div>
    <div style="font-family:Georgia,serif;font-size:48px;font-weight:400;color:#1a0f0a;line-height:1;margin-bottom:6px">${word}</div>
    <div style="font-size:12px;color:#9a7850;font-style:italic;font-family:monospace;margin-bottom:6px;letter-spacing:0.04em">${pronunciation}</div>
    <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#c8a96e;margin-bottom:14px;font-family:monospace">${language}</div>
    <div style="height:1px;background:#c8a96e;margin-bottom:14px;width:60px;opacity:0.6"></div>
    <div style="font-size:14px;color:#4a3520;line-height:1.75;font-family:Georgia,serif">${definition}</div>
  </td></tr>
</table>

<!-- Gargi Section -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#2d1810;border-collapse:collapse">
  <tr><td style="padding:28px 32px;border-bottom:3px solid #8b4513">
    <div style="font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:#c8a96e;font-family:monospace;margin-bottom:14px">
      Where Gargi felt this
    </div>
    <div style="font-size:14px;color:#f0e0c8;line-height:1.8;font-family:Georgia,serif">${gargiStory.replace(/\n/g, "<br/><br/>")}</div>
    <div style="margin-top:14px;font-size:10px;letter-spacing:0.14em;color:#9a6840;font-family:monospace;text-transform:uppercase">
      📍 ${location}
    </div>
  </td></tr>
</table>

<!-- Triples -->
<table class="triples-table" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;border-collapse:collapse;border-bottom:1px solid #e8dcc8">
  <tr>
    <td class="triple-cell" width="33%" style="padding:18px 16px;border-right:1px solid #e8dcc8;vertical-align:top">
      <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9a7850;margin-bottom:6px;font-family:monospace">On the map</div>
      <div style="font-size:12px;color:#2d1810;line-height:1.5;font-family:Georgia,serif">${mapNote}</div>
    </td>
    <td class="triple-cell" width="33%" style="padding:18px 16px;border-right:1px solid #e8dcc8;vertical-align:top">
      <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9a7850;margin-bottom:6px;font-family:monospace">Song for this</div>
      <div style="font-size:12px;color:#2d1810;line-height:1.5;font-family:Georgia,serif">${song}</div>
    </td>
    <td class="triple-cell" width="33%" style="padding:18px 16px;vertical-align:top">
      <div style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9a7850;margin-bottom:6px;font-family:monospace">Pair with</div>
      <div style="font-size:12px;color:#2d1810;line-height:1.5;font-family:Georgia,serif">${pairWith}</div>
    </td>
  </tr>
</table>

<!-- Question -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#4a1e0a;border-collapse:collapse">
  <tr><td style="padding:28px 32px;border-bottom:3px solid #c8a96e">
    <div style="font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:#c8a96e;font-family:monospace;margin-bottom:14px">
      Your question this month
    </div>
    <div style="font-family:Georgia,serif;font-size:16px;color:#fdf0d8;line-height:1.55;font-style:italic;margin-bottom:12px">
      "${question}"
    </div>
    <div style="font-size:12px;color:#c8905a;line-height:1.6;font-family:Georgia,serif">
      Reply to this email. I read every single one. The best answers find their way into next month's dispatch.
    </div>
  </td></tr>
</table>

<!-- CTA -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;border-collapse:collapse">
  <tr><td style="padding:24px 32px;border-bottom:1px solid #e8dcc8;text-align:center">
    <a href="${storyUrl}" style="display:inline-block;padding:12px 32px;background:#1a0f0a;color:#c8a96e;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;font-family:monospace;border:1px solid #c8a96e">
      Read this month's full story →
    </a>
    <div style="font-size:11px;color:#9a7850;margin-top:10px;font-family:monospace">${storyCity}</div>
  </td></tr>
</table>

<!-- Sign off -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0f0a;border-collapse:collapse">
  <tr><td style="padding:24px 32px;border-bottom:1px solid #2d1810">
    <div style="font-size:13px;color:#c8a070;line-height:1.7;font-family:Georgia,serif;font-style:italic;margin-bottom:14px">
      ${closingLine}
    </div>
    <div style="font-size:16px;color:#f0e0c8;font-family:Georgia,serif">Gargi</div>
    <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#7a5a30;font-family:monospace;margin-top:3px">
      Somewhere on the road · TheRoamingPostcards
    </div>
  </td></tr>
</table>

<!-- Footer -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#120a06;border-collapse:collapse">
  <tr>
    <td style="padding:14px 28px;font-size:10px;color:#7a5a30;font-family:monospace;letter-spacing:0.1em">
      ✦ TheRoamingPostcards
    </td>
    <td style="padding:14px 28px;text-align:right">
      <span style="font-size:10px;color:#5a4020;font-family:monospace">View online</span>
      <span style="font-size:10px;color:#3a2810;font-family:monospace;margin-left:16px">Unsubscribe</span>
    </td>
  </tr>
</table>

</div>
</body>
</html>`;
}