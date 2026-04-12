"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  INDIA_STATE_PATHS,
  INDIA_STATE_LABELS,
  STATE_DB_TO_CANONICAL,
  INDIA_MAP_VIEWBOX,
} from "@/lib/indiaMapData";

export interface ExploreStory {
  id: string;
  title: string;
  city: string;
  state: string | null;
  country: string;
  slug: string;
  coverImage: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  stateName: string;
  count: number;
}

function normalizeState(raw: string | null): string | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  return STATE_DB_TO_CANONICAL[key] ?? raw.trim();
}

export default function IndiaMapClient({
  stories,
}: {
  stories: ExploreStory[];
}) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    stateName: "",
    count: 0,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  // Group stories by canonical state
  const stateData: Record<string, ExploreStory[]> = {};
  for (const story of stories) {
    const canonical = normalizeState(story.state);
    if (!canonical) continue;
    if (!stateData[canonical]) stateData[canonical] = [];
    stateData[canonical].push(story);
  }

  const visitedStates = new Set(Object.keys(stateData));
  const filteredStories = selectedState
    ? (stateData[selectedState] ?? [])
    : stories;

  function handleMouseEnter(
    e: React.MouseEvent<SVGPathElement>,
    stateName: string
  ) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      stateName,
      count: stateData[stateName]?.length ?? 0,
    });
  }

  function handleMouseMove(e: React.MouseEvent<SVGPathElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  function handleClick(stateName: string) {
    if (!visitedStates.has(stateName)) return;
    setSelectedState((prev) => (prev === stateName ? null : stateName));
  }

  return (
    <div style={{ color: "var(--text-primary)" }}>
      <style>{`
        .india-state {
          transition: fill 0.15s ease, fill-opacity 0.15s ease;
        }
        .india-state.visited:hover {
          fill-opacity: 0.75 !important;
          cursor: pointer;
        }
        .india-state.selected {
          filter: drop-shadow(0 0 5px var(--accent));
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .story-card { animation: fadeUp 0.3s ease both; }
      `}</style>

      {/* ── HEADER ── */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-10">
        <p
          className="text-xs tracking-[0.4em] uppercase mb-3 font-mono"
          style={{ color: "var(--accent)" }}
        >
          The Territory
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: "var(--text-primary)" }}
        >
          Explore India
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {visitedStates.size === 0
            ? "No states explored yet."
            : `${visitedStates.size} ${visitedStates.size === 1 ? "state" : "states"} explored · ${stories.length} ${stories.length === 1 ? "story" : "stories"} documented`}
        </p>
      </div>

      {/* ── MAP ── */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div
          className="relative rounded-2xl overflow-visible"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Legend */}
          <div
            className="absolute top-4 right-4 z-10 flex flex-col gap-2 px-3 py-2.5 rounded-xl text-xs font-mono"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: "var(--accent)", opacity: 0.75 }}
              />
              <span style={{ color: "var(--text-muted)" }}>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                }}
              />
              <span style={{ color: "var(--text-muted)" }}>Not yet</span>
            </div>
          </div>

          <div className="relative p-4">
            <svg
              ref={svgRef}
              viewBox={INDIA_MAP_VIEWBOX}
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ maxHeight: "85vh", display: "block" }}
            >
              {Object.entries(INDIA_STATE_PATHS).map(([stateName, d]) => {
                const isVisited = visitedStates.has(stateName);
                const isSelected = selectedState === stateName;
                return (
                  <path
                    key={stateName}
                    d={d}
                    fill={isSelected || isVisited ? "var(--accent)" : "var(--text-primary)"}
                    fillOpacity={isSelected ? 0.92 : isVisited ? 0.52 : 0.07}
                    stroke={isSelected ? "var(--accent)" : "var(--text-primary)"}
                    strokeWidth={isSelected ? 1.8 : 0.6}
                    strokeOpacity={isSelected ? 1 : 0.25}
                    className={`india-state${isVisited ? " visited" : ""}${isSelected ? " selected" : ""}`}
                    onMouseEnter={(e) => handleMouseEnter(e, stateName)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(stateName)}
                  />
                );
              })}

              {/* Labels */}
              {Object.entries(INDIA_STATE_LABELS).map(([stateName, [x, y]]) => {
                const isVisited = visitedStates.has(stateName);
                const SHORT: Record<string, string> = {
                  "Andaman and Nicobar Islands": "A&N Islands",
                  "Dadra and Nagar Haveli and Daman and Diu": "DNH & DD",
                  "Arunachal Pradesh": "Arunachal",
                  "Himachal Pradesh": "Himachal",
                };
                return (
                  <text
                    key={stateName}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="monospace"
                    fill={isVisited ? "var(--accent)" : "var(--text-muted)"}
                    opacity={isVisited ? 0.95 : 0.38}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {SHORT[stateName] ?? stateName}
                  </text>
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && (
              <div
                className="absolute z-30 pointer-events-none px-3 py-2 rounded-lg text-xs font-mono"
                style={{
                  left: Math.min(tooltip.x + 14, 680),
                  top: Math.max(tooltip.y - 52, 8),
                  background: "rgba(8,8,12,0.95)",
                  border: "1px solid var(--accent)",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                  minWidth: 130,
                }}
              >
                <div
                  style={{
                    color: "var(--accent)",
                    fontWeight: "bold",
                    letterSpacing: "0.06em",
                    marginBottom: 3,
                  }}
                >
                  {tooltip.stateName}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 10 }}>
                  {tooltip.count === 0
                    ? "Not yet explored"
                    : `${tooltip.count} ${tooltip.count === 1 ? "story" : "stories"}`}
                </div>
                {tooltip.count > 0 && (
                  <div style={{ color: "var(--text-muted)", fontSize: 9, marginTop: 2, opacity: 0.6 }}>
                    click to filter ↓
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="flex items-center gap-3 flex-wrap">
          {selectedState ? (
            <>
              <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                Showing
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-mono font-semibold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {selectedState}
              </span>
              <button
                onClick={() => setSelectedState(null)}
                className="text-xs font-mono px-2 py-1 rounded transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
              >
                × clear
              </button>
            </>
          ) : visitedStates.size > 0 ? (
            <>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                Jump to:
              </span>
              {Array.from(visitedStates).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedState(s)}
                  className="text-xs px-2.5 py-1 rounded-full font-mono transition-all hover:opacity-80"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  {s}
                  <span className="ml-1.5" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
                    {stateData[s].length}
                  </span>
                </button>
              ))}
            </>
          ) : null}
        </div>
      </div>

      {/* ── STORY GRID ── */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {filteredStories.length === 0 && selectedState ? (
          <p className="text-center py-20 font-serif italic" style={{ color: "var(--text-muted)" }}>
            No stories from {selectedState} yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, i) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="story-card group block"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div
                  className="relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    height: 260,
                  }}
                >
                  {story.coverImage && (
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${story.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 58%)",
                    }}
                  />
                  <div className="absolute bottom-0 p-4">
                    <p
                      className="text-xs tracking-widest uppercase mb-1 font-mono"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                    >
                      {story.state ?? story.country}
                    </p>
                    <h3
                      className="text-lg font-bold text-white leading-tight"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {story.city}
                    </h3>
                    <p className="text-sm mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.58)" }}>
                      {story.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}