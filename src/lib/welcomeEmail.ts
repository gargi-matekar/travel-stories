// src/lib/welcomeEmail.ts
// Sent immediately when someone subscribes

export function generateWelcomeEmail(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Welcome to TheRoamingPostcards</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif">
<div style="max-width:520px;margin:0 auto;padding:24px 12px">

  <!-- pre-header -->
  <div style="text-align:center;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8a6a;font-family:monospace;margin-bottom:16px">
    ✦ TheRoamingPostcards · A dispatch from the road
  </div>

  <!-- header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0f0a;border-collapse:collapse">
    <tr>
      <td style="padding:18px 28px;font-family:Georgia,serif;font-size:15px;color:#c8a96e;letter-spacing:0.06em">
        ✦ TheRoamingPostcards
      </td>
      <td style="padding:18px 28px;text-align:right;font-size:10px;color:#7a6040;font-family:monospace;letter-spacing:0.1em">
        Welcome Dispatch
      </td>
    </tr>
  </table>

  <!-- temple illustration — PNG hosted at API route, works in all email clients -->
  <div style="background:#1a0f0a;border-bottom:3px solid #c8a96e;line-height:0">
    <img src="https://travel-stories-eight.vercel.app/api/newsletter/temple" width="560" height="220" alt="TheRoamingPostcards Temple" style="display:block;width:100%;max-width:560px;border:0"/>
  </div>

  <!-- body -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f0;border-collapse:collapse">
    <tr><td style="padding:32px 32px 28px;border-bottom:1px solid #e8dcc8">
      <div style="font-size:9px;letter-spacing:0.32em;text-transform:uppercase;color:#9a7850;font-family:monospace;margin-bottom:16px">
        You're on the list ✦
      </div>
      <div style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:#1a0f0a;line-height:1.2;margin-bottom:16px">
        The road will find you<br/>from here.
      </div>
      <div style="height:1px;background:#c8a96e;margin-bottom:16px;width:48px;opacity:0.6"></div>
      <div style="font-size:14px;color:#4a3520;line-height:1.8;font-family:Georgia,serif">
        Thank you for joining. Every month, I'll send you one untranslatable word — and the story of where I felt it. A song, a place on the map, and a question to sit with.
        <br/><br/>
        No fixed schedule. Sent when the road speaks. You'll know it when it arrives.
      </div>
    </td></tr>
  </table>

  <!-- what to expect -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#2d1810;border-collapse:collapse">
    <tr><td style="padding:24px 32px;border-bottom:3px solid #8b4513">
      <div style="font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:#c8a96e;font-family:monospace;margin-bottom:16px">
        What each dispatch contains
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${[
          ["✦", "One untranslatable word", "A feeling that exists in another language but not yours"],
          ["📍", "Where I felt it", "A specific moment from the road — honest, not polished"],
          ["♪", "Song for this", "The music that captures the feeling"],
          ["?", "Your question", "Something to sit with this month"],
        ].map(([icon, label, desc]) => `
        <tr>
          <td width="24" style="vertical-align:top;padding:6px 12px 6px 0;font-size:12px;color:#c8a96e">${icon}</td>
          <td style="padding:6px 0">
            <div style="font-size:12px;font-weight:500;color:#f0e0c8;font-family:monospace;letter-spacing:0.04em">${label}</div>
            <div style="font-size:11px;color:#9a6840;margin-top:2px;font-family:Georgia,serif">${desc}</div>
          </td>
        </tr>`).join("")}
      </table>
    </td></tr>
  </table>

  <!-- sign off -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a0f0a;border-collapse:collapse">
    <tr><td style="padding:24px 32px;border-bottom:1px solid #2d1810">
      <div style="font-size:13px;color:#c8a070;line-height:1.7;font-family:Georgia,serif;font-style:italic;margin-bottom:14px">
        Until the first dispatch — keep a bag half-packed and a question half-asked.
      </div>
      <div style="font-size:15px;color:#f0e0c8;font-family:Georgia,serif">Gargi</div>
      <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#7a5a30;font-family:monospace;margin-top:3px">
        Somewhere on the road · TheRoamingPostcards
      </div>
    </td></tr>
  </table>

  <!-- footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#120a06;border-collapse:collapse">
    <tr>
      <td style="padding:14px 28px;font-size:10px;color:#7a5a30;font-family:monospace;letter-spacing:0.1em">
        ✦ TheRoamingPostcards
      </td>
      <td style="padding:14px 28px;text-align:right;font-size:10px;color:#5a4020;font-family:monospace">
        You subscribed at theroamingpostcards · Unsubscribe
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;
}