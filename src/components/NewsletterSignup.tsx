"use client";
// src/components/NewsletterSignup.tsx

import { useState, useEffect, useRef } from "react";

interface Props {
  variant?: "homepage" | "story";
  storySlug?: string;
  storyCity?: string;
}

export default function NewsletterSignup({
  variant = "homepage",
  storySlug,
  storyCity,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle"|"loading"|"success"|"duplicate"|"error">("idle");
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  async function handleSubmit() {
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: variant === "story" ? "story_page" : "homepage",
          storySlug: storySlug ?? null,
        }),
      });
      if (res.status === 409) { setState("duplicate"); return; }
      if (!res.ok) { setState("error"); return; }
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  // ── HOMEPAGE VARIANT ─────────────────────────────────────────────────────
  if (variant === "homepage") {
    return (
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#0a0a0f",
          borderTop: "1px solid rgba(200,169,110,0.12)",
          borderBottom: "1px solid rgba(200,169,110,0.12)",
        }}
      >
        <style>{`
          /* ── floating particles ── */
          @keyframes float1 {
            0%,100% { transform: translateY(0px) translateX(0px); opacity:0.3; }
            33%      { transform: translateY(-22px) translateX(8px); opacity:0.6; }
            66%      { transform: translateY(-10px) translateX(-6px); opacity:0.4; }
          }
          @keyframes float2 {
            0%,100% { transform: translateY(0px) translateX(0px); opacity:0.2; }
            50%      { transform: translateY(-30px) translateX(-10px); opacity:0.5; }
          }
          @keyframes float3 {
            0%,100% { transform: translateY(0px); opacity:0.15; }
            40%      { transform: translateY(-18px); opacity:0.4; }
            80%      { transform: translateY(-8px); opacity:0.25; }
          }
          /* ── scroll-triggered reveals ── */
          @keyframes nlFadeUp {
            from { opacity:0; transform:translateY(28px); }
            to   { opacity:1; transform:translateY(0); }
          }
          @keyframes nlFadeLeft {
            from { opacity:0; transform:translateX(24px); }
            to   { opacity:1; transform:translateX(0); }
          }
          @keyframes stampIn {
            0%   { opacity:0; transform:scale(1.4) rotate(-12deg); }
            55%  { opacity:1; transform:scale(0.93) rotate(2deg); }
            100% { opacity:1; transform:scale(1) rotate(0deg); }
          }
          @keyframes glowPulse {
            0%,100% { opacity:0.12; }
            50%      { opacity:0.22; }
          }
          @keyframes lineGrow {
            from { transform:scaleX(0); }
            to   { transform:scaleX(1); }
          }
          @keyframes successPop {
            0%   { transform:scale(0.8); opacity:0; }
            60%  { transform:scale(1.06); opacity:1; }
            100% { transform:scale(1); opacity:1; }
          }

          .nl-vis-1 { opacity:0; }
          .nl-vis-2 { opacity:0; }
          .nl-vis-3 { opacity:0; }
          .nl-vis-4 { opacity:0; }
          .nl-vis-stamp { opacity:0; }

          .nl-animate .nl-vis-1 { animation: nlFadeUp   0.7s 0.05s ease both; }
          .nl-animate .nl-vis-2 { animation: nlFadeUp   0.7s 0.2s  ease both; }
          .nl-animate .nl-vis-3 { animation: nlFadeUp   0.7s 0.35s ease both; }
          .nl-animate .nl-vis-4 { animation: nlFadeUp   0.7s 0.5s  ease both; }
          .nl-animate .nl-vis-stamp { animation: stampIn 0.65s 0.6s cubic-bezier(0.34,1.3,0.64,1) both; }

          .nl-glow { animation: glowPulse 4s ease-in-out infinite; }

          .nl-p1 { animation: float1 7s 0s ease-in-out infinite; }
          .nl-p2 { animation: float2 9s 1s ease-in-out infinite; }
          .nl-p3 { animation: float3 6s 2s ease-in-out infinite; }
          .nl-p4 { animation: float1 8s 3s ease-in-out infinite; }
          .nl-p5 { animation: float2 10s 0.5s ease-in-out infinite; }
          .nl-p6 { animation: float3 7s 1.5s ease-in-out infinite; }

          .nl-line { transform-origin: left; animation: lineGrow 0.8s 0.25s ease both; }

          .nl-input-hp { background: rgba(255,255,255,0.04) !important; border: 1px solid rgba(200,169,110,0.2) !important; color: #f0e8d8 !important; transition: border-color 0.2s, background 0.2s; }
          .nl-input-hp::placeholder { color: rgba(200,169,110,0.3); }
          .nl-input-hp:focus { outline:none; border-color: rgba(200,169,110,0.6) !important; background: rgba(255,255,255,0.07) !important; }
          .nl-btn-hp { background: transparent; border: 1px solid rgba(200,169,110,0.35); color: #c8a96e; transition: all 0.2s; white-space:nowrap; }
          .nl-btn-hp:hover { background: #c8a96e !important; color: #0a0a0f !important; border-color: #c8a96e !important; }
          .nl-success { animation: successPop 0.5s cubic-bezier(0.34,1.3,0.64,1) both; }

          .nl-stats-item { border-right: 1px solid rgba(200,169,110,0.1); }
          .nl-stats-item:last-child { border-right: none; }
        `}</style>

        {/* ── atmospheric glow blobs ── */}
        <div className="nl-glow" style={{ position:"absolute", top:"-30%", left:"15%", width:500, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(200,169,110,0.07) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-20%", right:"10%", width:400, height:300, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(200,169,110,0.05) 0%,transparent 70%)", pointerEvents:"none", animation:"glowPulse 6s 2s ease-in-out infinite" }} />

        {/* ── floating dust particles ── */}
        {[
          { cl:"nl-p1", top:"18%", left:"8%", size:2 },
          { cl:"nl-p2", top:"55%", left:"5%", size:1.5 },
          { cl:"nl-p3", top:"30%", left:"88%", size:2 },
          { cl:"nl-p4", top:"70%", left:"92%", size:1 },
          { cl:"nl-p5", top:"80%", left:"20%", size:1.5 },
          { cl:"nl-p6", top:"12%", left:"75%", size:1 },
        ].map((p,i) => (
          <div key={i} className={p.cl} style={{ position:"absolute", top:p.top, left:p.left, width:p.size, height:p.size, borderRadius:"50%", background:"#c8a96e", pointerEvents:"none" }} />
        ))}

        {/* ── diagonal stamp lines background ── */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.025, pointerEvents:"none" }} xmlns="http://www.w3.org/2000/svg">
          <line x1="-10%" y1="110%" x2="110%" y2="-10%" stroke="#c8a96e" strokeWidth="1" strokeDasharray="6 14"/>
          <line x1="-10%" y1="85%"  x2="85%"  y2="-10%" stroke="#c8a96e" strokeWidth="1" strokeDasharray="6 14"/>
          <line x1="5%"   y1="110%" x2="110%" y2="5%"   stroke="#c8a96e" strokeWidth="1" strokeDasharray="6 14"/>
        </svg>

        {/* ── main content ── */}
        <div
          className={visible ? "nl-animate" : ""}
          style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px" }}
        >
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"center" }}>

            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div className="nl-vis-1" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div className="nl-line" style={{ height:1, width:32, background:"#c8a96e", opacity:0.6 }} />
                <span style={{ fontSize:10, letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(200,169,110,0.6)", fontFamily:"monospace" }}>
                  Postcard Dispatches
                </span>
              </div>

              {/* headline */}
              <div className="nl-vis-2">
                <h2 style={{ fontFamily:"Georgia,serif", fontWeight:400, fontSize:"clamp(2rem,4vw,3.2rem)", color:"#f0e8d8", lineHeight:1.15, marginBottom:16, letterSpacing:"-0.01em" }}>
                  Come along on<br/>
                  <em style={{ fontStyle:"italic", color:"#c8a96e" }}>Gargi's journeys.</em>
                </h2>
              </div>

              {/* body */}
              <div className="nl-vis-3">
                <p style={{ fontSize:15, color:"rgba(240,232,216,0.55)", lineHeight:1.8, maxWidth:460, marginBottom:32, fontFamily:"Georgia,serif" }}>
                  Every month — one untranslatable word, and the story of where Gargi felt it.
                  A song, a place, a question to sit with.
                  No schedule, no noise. Sent when the road speaks.
                </p>
              </div>

              {/* form */}
              <div className="nl-vis-4">
                {state === "success" ? (
                  <div className="nl-success" style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0" }}>
                    <div style={{ width:40, height:40, border:"1px solid rgba(200,169,110,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ color:"#c8a96e", fontSize:18 }}>✦</span>
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:500, color:"#c8a96e", fontFamily:"monospace", letterSpacing:"0.06em" }}>You're on the list.</p>
                      <p style={{ fontSize:12, color:"rgba(200,169,110,0.5)", marginTop:3, fontFamily:"monospace" }}>First dispatch finds you soon.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", gap:10, maxWidth:480 }}>
                    <input
                      className="nl-input-hp"
                      style={{ flex:1, padding:"13px 16px", fontSize:13, fontFamily:"monospace", borderRadius:4 }}
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={handleKey}
                      disabled={state === "loading"}
                    />
                    <button
                      className="nl-btn-hp"
                      style={{ padding:"13px 22px", fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"monospace", borderRadius:4, cursor:"pointer", opacity:state==="loading"?0.6:1 }}
                      onClick={handleSubmit}
                      disabled={state === "loading"}
                    >
                      {state === "loading" ? "Sending..." : "Join the journey"}
                    </button>
                  </div>
                )}

                {state === "duplicate" && (
                  <p style={{ fontSize:11, color:"rgba(200,169,110,0.5)", marginTop:10, fontFamily:"monospace" }}>Already subscribed ✦</p>
                )}
                {state === "error" && (
                  <p style={{ fontSize:11, color:"rgba(200,100,80,0.8)", marginTop:10, fontFamily:"monospace" }}>Something went wrong — try again.</p>
                )}

                <p style={{ fontSize:11, color:"rgba(200,169,110,0.25)", marginTop:12, fontFamily:"monospace", letterSpacing:"0.04em" }}>
                  Free forever · No spam · Unsubscribe anytime
                </p>
              </div>
            </div>

            {/* RIGHT: envelope + stamp + postmark */}
            <div className="nl-vis-stamp" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, paddingRight:16 }}>

              {/* envelope */}
              <div style={{ position:"relative", width:110, height:82 }}>
                <div style={{ width:110, height:82, border:"1px solid rgba(200,169,110,0.25)", borderRadius:3, background:"rgba(200,169,110,0.04)", position:"relative", overflow:"hidden" }}>
                  <svg viewBox="0 0 110 40" style={{ position:"absolute", top:0, left:0, width:110, height:40 }}>
                    <polygon points="0,0 110,0 55,36" fill="rgba(200,169,110,0.06)" stroke="rgba(200,169,110,0.18)" strokeWidth="0.5"/>
                  </svg>
                  <div style={{ position:"absolute", bottom:12, left:12, right:12, display:"flex", flexDirection:"column", gap:5 }}>
                    <div style={{ height:1, background:"rgba(200,169,110,0.15)", borderRadius:1 }} />
                    <div style={{ height:1, background:"rgba(200,169,110,0.12)", borderRadius:1 }} />
                    <div style={{ height:1, width:"60%", background:"rgba(200,169,110,0.1)", borderRadius:1 }} />
                  </div>
                </div>
              </div>

              {/* stamp */}
              <div style={{ width:42, height:50, border:"1px solid rgba(200,169,110,0.3)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, borderRadius:2, position:"relative" }}>
                {/* perforated dots */}
                {[-8,-2,4,10,16,22].map(y => (
                  <div key={y} style={{ position:"absolute", left:-3, top:y+16, width:4, height:4, borderRadius:"50%", background:"#0a0a0f", border:"1px solid rgba(200,169,110,0.2)" }} />
                ))}
                {[-8,-2,4,10,16,22].map(y => (
                  <div key={y} style={{ position:"absolute", right:-3, top:y+16, width:4, height:4, borderRadius:"50%", background:"#0a0a0f", border:"1px solid rgba(200,169,110,0.2)" }} />
                ))}
                <span style={{ color:"#c8a96e", fontSize:16, opacity:0.8 }}>✦</span>
                <span style={{ fontSize:7, color:"rgba(200,169,110,0.5)", fontFamily:"monospace", letterSpacing:"0.1em" }}>TRP</span>
              </div>

              {/* postmark */}
              <svg width="58" height="58" viewBox="0 0 58 58" style={{ opacity:0.18 }}>
                <circle cx="29" cy="29" r="26" fill="none" stroke="#c8a96e" strokeWidth="1.2"/>
                <circle cx="29" cy="29" r="19" fill="none" stroke="#c8a96e" strokeWidth="0.5"/>
                <line x1="3" y1="29" x2="55" y2="29" stroke="#c8a96e" strokeWidth="2"/>
                <line x1="3" y1="24" x2="55" y2="24" stroke="#c8a96e" strokeWidth="0.6"/>
                <line x1="3" y1="34" x2="55" y2="34" stroke="#c8a96e" strokeWidth="0.6"/>
              </svg>
            </div>
          </div>

          {/* ── stats strip ── */}
          <div
            className="nl-vis-4"
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", marginTop:56, borderTop:"1px solid rgba(200,169,110,0.1)" }}
          >
            {[
              { val:"Monthly",  sub:"One word, one story" },
              { val:"Personal", sub:"One voice — Gargi's" },
              { val:"Free",     sub:"Always & forever" },
            ].map((s,i) => (
              <div key={i} className="nl-stats-item" style={{ padding:"20px 0 0", paddingRight: i < 2 ? 24 : 0, paddingLeft: i > 0 ? 24 : 0 }}>
                <p style={{ fontSize:18, fontFamily:"Georgia,serif", color:"#f0e8d8", marginBottom:4 }}>{s.val}</p>
                <p style={{ fontSize:11, color:"rgba(200,169,110,0.4)", fontFamily:"monospace", letterSpacing:"0.04em" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── STORY PAGE VARIANT ───────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="py-20 px-6"
      style={{ borderTop:"1px solid var(--border)" }}
    >
      <style>{`
        .nl-story-input:focus { outline:none; border-color: var(--accent) !important; }
        .nl-story-btn:hover { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; }
      `}</style>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
          {/* top band */}
          <div style={{ background:"var(--card-bg)", borderBottom:"1px solid var(--border)", padding:"20px 28px", display:"flex", alignItems:"center", gap:10 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" style={{ opacity:0.18, flexShrink:0 }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--text-primary)" strokeWidth="1"/>
              <line x1="2" y1="18" x2="34" y2="18" stroke="var(--text-primary)" strokeWidth="1.5"/>
              <line x1="2" y1="14" x2="34" y2="14" stroke="var(--text-primary)" strokeWidth="0.5"/>
              <line x1="2" y1="22" x2="34" y2="22" stroke="var(--text-primary)" strokeWidth="0.5"/>
            </svg>
            <div>
              <p className="text-xs tracking-[0.28em] uppercase font-mono" style={{ color:"var(--accent)" }}>✦ Postcard Dispatches</p>
              <p className="text-xs font-mono mt-0.5" style={{ color:"var(--text-muted)" }}>TheRoamingPostcards · Monthly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* left: copy + form */}
            <div style={{ padding:"28px", borderRight:"1px solid var(--border)" }}>
              <h3 className="font-serif font-light mb-3 leading-tight" style={{ fontSize:"clamp(1.2rem,2.5vw,1.6rem)", color:"var(--text-primary)" }}>
                Want the next dispatch{" "}
                <em className="not-italic" style={{ color:"var(--accent)" }}>in your inbox?</em>
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--text-secondary)" }}>
                Every month — one untranslatable word, where Gargi felt it, a song, and a question to sit with.
              </p>

              {state === "success" ? (
                <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--accent)", padding:"8px 0" }}>
                  <span>✦</span>
                  <div>
                    <p className="text-sm font-mono">You're on the list.</p>
                    <p className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>First dispatch finds you soon.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    className="nl-story-input w-full px-4 py-2.5 text-sm font-mono rounded-lg"
                    style={{ background:"var(--bg)", border:"1px solid var(--border)", color:"var(--text-primary)", transition:"border-color 0.15s" }}
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={state === "loading"}
                  />
                  <button
                    className="nl-story-btn w-full py-2.5 text-xs tracking-[0.12em] uppercase font-mono rounded-lg transition-all duration-200"
                    style={{ background:"transparent", border:"1px solid var(--border)", color:"var(--text-primary)", cursor:"pointer", opacity:state==="loading"?0.6:1 }}
                    onClick={handleSubmit}
                    disabled={state === "loading"}
                  >
                    {state === "loading" ? "Sending..." : "Yes, send me postcards →"}
                  </button>
                </div>
              )}

              {state === "duplicate" && <p className="text-xs mt-2 font-mono" style={{ color:"var(--text-muted)" }}>Already subscribed ✦</p>}
              {state === "error" && <p className="text-xs mt-2 font-mono" style={{ color:"var(--accent)" }}>Something went wrong — try again.</p>}
              <p className="text-xs mt-4 font-mono" style={{ color:"var(--text-muted)", opacity:0.55 }}>Free · No spam · Unsubscribe anytime</p>
            </div>

            {/* right: what a dispatch looks like */}
            <div style={{ padding:"28px", background:"var(--card-bg)" }}>
              <p className="text-xs tracking-[0.2em] uppercase font-mono mb-4" style={{ color:"var(--text-muted)" }}>What a dispatch looks like</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon:"✦", label:"The word", desc:"One untranslatable feeling, defined" },
                  { icon:"📍", label:"Where Gargi felt it", desc:"A personal story from the road" },
                  { icon:"♪",  label:"Song for this", desc:"The soundtrack of the moment" },
                  { icon:"?",  label:"Your question", desc:"Something to sit with this month" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-xs mt-0.5 font-mono w-4 flex-shrink-0" style={{ color:"var(--accent)" }}>{item.icon}</span>
                    <div>
                      <p className="text-xs font-medium font-mono" style={{ color:"var(--text-primary)" }}>{item.label}</p>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}