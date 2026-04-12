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
<img src="https://travel-stories-eight.vercel.app/api/newsletter/temple" width="560" height="220" alt="TheRoamingPostcards Temple" style="display:block;width:100%;max-width:560px;border:0"/>
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