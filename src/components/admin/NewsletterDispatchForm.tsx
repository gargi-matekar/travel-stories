"use client";
// src/components/admin/NewsletterDispatchForm.tsx

import { useState } from "react";

interface SendResult {
  sent: number;
  failed: number;
  total: number;
  message?: string;
}

export default function NewsletterDispatchForm({
  subscriberCount,
}: {
  subscriberCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    issueNumber: "",
    month: "",
    word: "",
    pronunciation: "",
    language: "",
    definition: "",
    gargiStory: "",
    location: "",
    mapNote: "",
    song: "",
    pairWith: "",
    question: "",
    storyUrl: "",
    storyCity: "",
    closingLine: "",
    templeCity: "",
    templeCoords: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSend() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          issueNumber: parseInt(form.issueNumber) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send");
        return;
      }
      setResult(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inp =
    "w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a96e]/40 transition-colors text-sm rounded-sm";
  const lbl = "block text-xs tracking-widest text-gray-500 uppercase mb-2";
  const ta =
    "w-full px-4 py-3 bg-[#111] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#c8a96e]/40 transition-colors text-sm rounded-sm resize-y";

  return (
    <div className="mb-16">
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-serif font-light text-white">
            Newsletter
          </h2>
          <p className="text-gray-500 mt-1">
            {subscriberCount}{" "}
            {subscriberCount === 1 ? "subscriber" : "subscribers"} · Send a
            Travelogue dispatch
          </p>
        </div>
        <button
          onClick={() => { setOpen((p) => !p); setResult(null); setError(""); }}
          className="px-5 py-2.5 bg-white text-black text-sm font-medium hover:bg-[#f5f0e8] transition-colors"
        >
          {open ? "✕ Close" : "✦ Send Dispatch"}
        </button>
      </div>

      {/* ── Subscriber count bar ── */}
      {!open && (
        <div className="border border-white/5 bg-[#0d0d0d] rounded px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border border-[#c8a96e]/25 flex items-center justify-center"
              style={{ background: "rgba(200,169,110,0.06)" }}
            >
              <span style={{ color: "#c8a96e", fontSize: 16 }}>✦</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {subscriberCount} subscribers waiting
              </p>
              <p className="text-gray-600 text-xs mt-0.5">
                Click "Send Dispatch" to compose and send the monthly Travelogue
              </p>
            </div>
          </div>
          {subscriberCount === 0 && (
            <span className="text-xs text-gray-600 font-mono">
              No subscribers yet
            </span>
          )}
        </div>
      )}

      {/* ── Dispatch Form ── */}
      {open && (
        <div className="border border-[#c8a96e]/15 bg-[#0d0d0d] rounded p-6 space-y-8">
          {/* Issue meta */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              Issue Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Issue Number *</label>
                <input
                  name="issueNumber"
                  type="number"
                  value={form.issueNumber}
                  onChange={handleChange}
                  className={inp}
                  placeholder="12"
                />
              </div>
              <div>
                <label className={lbl}>Month *</label>
                <input
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className={inp}
                  placeholder="April 2026"
                />
              </div>
            </div>
          </div>

          {/* The Word */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              The Word
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={lbl}>Word *</label>
                <input
                  name="word"
                  value={form.word}
                  onChange={handleChange}
                  className={inp}
                  placeholder="e.g. Mamihlapinatapai"
                />
              </div>
              <div>
                <label className={lbl}>Pronunciation *</label>
                <input
                  name="pronunciation"
                  value={form.pronunciation}
                  onChange={handleChange}
                  className={inp}
                  placeholder="mah-mee-lah-pee-na-tah-pie"
                />
              </div>
              <div>
                <label className={lbl}>Language / Origin *</label>
                <input
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Yagán · Indigenous Patagonian"
                />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Definition *</label>
                <textarea
                  name="definition"
                  value={form.definition}
                  onChange={handleChange}
                  className={`${ta} min-h-[80px]`}
                  placeholder="A look shared between two people, each wishing the other would initiate..."
                />
              </div>
            </div>
          </div>

          {/* Gargi's story */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              Where You Felt This
            </p>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Your Story *</label>
                <textarea
                  name="gargiStory"
                  value={form.gargiStory}
                  onChange={handleChange}
                  className={`${ta} min-h-[120px]`}
                  placeholder="At a chai stall in Pondicherry. Two strangers, one bench, the same view of the sea..."
                />
                <p className="text-gray-700 text-xs mt-1.5">
                  Use \n for new paragraphs. Keep it personal and specific.
                </p>
              </div>
              <div>
                <label className={lbl}>Location *</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Pondicherry · Tamil Nadu · 5:42am"
                />
              </div>
            </div>
          </div>

          {/* Three columns */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              The Three Columns
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>On the map *</label>
                <input
                  name="mapNote"
                  value={form.mapNote}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Pondicherry coast at dawn"
                />
              </div>
              <div>
                <label className={lbl}>Song for this *</label>
                <input
                  name="song"
                  value={form.song}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Ilaiyaraaja — Ninaithale Inikkum"
                />
              </div>
              <div>
                <label className={lbl}>Pair with *</label>
                <input
                  name="pairWith"
                  value={form.pairWith}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Strong filter coffee and no plans"
                />
              </div>
            </div>
          </div>

          {/* Question + CTA */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              Reader Question & CTA
            </p>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Monthly Question *</label>
                <input
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  className={inp}
                  placeholder="When was the last time you stayed silent when you wanted to speak?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Story URL *</label>
                  <input
                    name="storyUrl"
                    value={form.storyUrl}
                    onChange={handleChange}
                    className={inp}
                    placeholder="https://travel-stories-eight.vercel.app/stories/pondicherry"
                  />
                </div>
                <div>
                  <label className={lbl}>Story City Label *</label>
                  <input
                    name="storyCity"
                    value={form.storyCity}
                    onChange={handleChange}
                    className={inp}
                    placeholder="Pondicherry · Tamil Nadu · April 2026"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Temple + closing */}
          <div>
            <p className="text-xs tracking-widest text-[#c8a96e] uppercase mb-4 font-mono opacity-60">
              Email Header Illustration
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={lbl}>Temple / City Name</label>
                <input
                  name="templeCity"
                  value={form.templeCity}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Meenakshi Amman (optional)"
                />
              </div>
              <div>
                <label className={lbl}>Coordinates Label</label>
                <input
                  name="templeCoords"
                  value={form.templeCoords}
                  onChange={handleChange}
                  className={inp}
                  placeholder="Madurai · Tamil Nadu (optional)"
                />
              </div>
            </div>
            <div>
              <label className={lbl}>Closing Sign-off *</label>
              <input
                name="closingLine"
                value={form.closingLine}
                onChange={handleChange}
                className={inp}
                placeholder="Until next month — may you find the word for what you've been feeling."
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-sm">
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {result && (
            <div className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-sm">
              ✓ Sent to {result.sent} subscriber{result.sent !== 1 ? "s" : ""}
              {result.failed > 0 && ` · ${result.failed} failed`}
              {result.message && ` · ${result.message}`}
            </div>
          )}

          {/* Send button */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/5">
            <button
              onClick={handleSend}
              disabled={loading || subscriberCount === 0}
              className="px-8 py-3 bg-white text-black font-medium hover:bg-[#f5f0e8] transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {loading
                ? "Sending..."
                : `Send to ${subscriberCount} subscriber${subscriberCount !== 1 ? "s" : ""}`}
            </button>
            <p className="text-gray-600 text-xs font-mono">
              This sends immediately to everyone in the DB. Cannot be undone.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}