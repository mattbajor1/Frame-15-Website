// src/sections/BTSCarousel.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useCloudinaryAssets from "../hooks/useCloudinaryAssets";
import Heading from "../components/Heading"; // <-- match Services heading

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Sharp Cloudinary image for the main stage (no secrets)
function cldImage({ public_id, type = "image", width, height, mode = "limit" }) {
  if (!CLOUD || !public_id) return null;
  const rt = type === "video" ? "video" : "image";
  const crop = mode === "limit" ? "c_limit" : "c_fill";
  const w = width ? `,w_${Math.round(width)}` : "";
  const h = height ? `,h_${Math.round(height)}` : "";
  return `https://res.cloudinary.com/${CLOUD}/${rt}/upload/f_auto,q_auto,g_auto,${crop}${w}${h}/${public_id}`;
}

// Thumbnail (poster for video)
function cldThumb({ public_id, type = "image", width = 240, height = 140 }) {
  if (!CLOUD || !public_id) return null;
  const rt = type === "video" ? "video" : "image";
  const ext = type === "video" ? ".jpg" : ""; // jpg poster for video
  return `https://res.cloudinary.com/${CLOUD}/${rt}/upload/f_auto,q_auto,g_auto,c_fill,w_${width},h_${height}/${public_id}${ext}`;
}

export default function BTSCarousel({
  title = "Behind the Scenes",
  subtitle = "See what we do together — how we prep, collaborate, and capture.",
  folder = "BTS",            // set to your exact Cloudinary BTS folder
  includeSubfolders = true,
}) {
  // Pull images + videos
  const { items, loading, error, hasMore, loadMore } = useCloudinaryAssets({
    folder,
    types: "all",
    includeSubfolders,
    pageSize: 60,
  });

  // Optional: put videos first (remove to keep natural order)
  const ordered = useMemo(() => {
    return [...items].sort((a, b) => (a.type === "video" ? -1 : 0));
  }, [items]);

  const [idx, setIdx] = useState(0);
  const stageRef = useRef(null);
  const railRef = useRef(null);

  // Measure stage for crisp sizing
  const [stageW, setStageW] = useState(1200);
  const [stageH, setStageH] = useState(600);
  useEffect(() => {
    if (!stageRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      const maxH = Math.floor(window.innerHeight * 0.68);
      const h = Math.min(maxH, Math.round((w * 9) / 16)); // ~16:9
      setStageW(w);
      setStageH(Math.max(360, h));
    });
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => {
    setIdx((i) => {
      const ni = Math.min(ordered.length - 1, i + 1);
      // If close to end, fetch more
      if (ni > ordered.length - 6 && hasMore && !loading) loadMore();
      return ni;
    });
  }, [ordered.length, hasMore, loading, loadMore]);

  // Center selected thumb in the rail
  useEffect(() => {
    if (!railRef.current) return;
    const el = railRef.current.querySelector(`[data-thumb="${idx}"]`);
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [idx]);

  const item = ordered[idx];

  return (
    <section id="bts" className="px-4 md:px-6 lg:px-8 py-24 bg-black text-white">
      {/* MATCHED HEADING (same component + styling as Services) */}
      <div className="max-w-6xl mx-auto px-4">
        <Heading
          title="Behind the Scenes"
          bgWord="BTS"
          className="text-4xl md:text-5xl text-yellow-500 mb-2"
        />
        {subtitle && <p className="text-neutral-300 mb-8">{subtitle}</p>}
        {error && (
          <div className="mt-3 rounded-lg bg-red-600/10 text-red-300 p-3 text-sm">{error}</div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Stage */}
        <div
          ref={stageRef}
          className="relative w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg"
        >
          <div className="relative w-full" style={{ height: stageH }}>
            {item ? (
              item.type === "video" ? (
                <video
                  key={item.public_id || idx}
                  src={item.videoUrl}
                  poster={
                    cldImage({
                      public_id: item.public_id,
                      type: "video",
                      width: stageW,
                      height: stageH,
                      mode: "fill",
                    }) || undefined
                  }
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  key={item.public_id || idx}
                  src={
                    cldImage({
                      public_id: item.public_id,
                      type: "image",
                      width: stageW * 1.5,
                      height: stageH * 1.5,
                      mode: "fill",
                    }) || item.src
                  }
                  alt={item.alt || ""}
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              )
            ) : (
              <div className="absolute inset-0 animate-pulse bg-white/5" />
            )}
          </div>

          {/* Arrows */}
          <button
            onClick={prev}
            disabled={idx === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40"
            aria-label="Previous"
          >
            <FiChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={next}
            disabled={idx === ordered.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40"
            aria-label="Next"
          >
            <FiChevronRight className="h-7 w-7" />
          </button>
        </div>

        {/* Film-strip thumbnails */}
        <div className="mt-4 relative">
          {/* decorative perforations */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_2px,transparent_3px)] bg-[size:28px_8px] bg-repeat-x" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_2px,transparent_3px)] bg-[size:28px_8px] bg-repeat-x" />

          <div
            ref={railRef}
            className="relative w-full overflow-x-auto whitespace-nowrap rounded-xl border border-white/10 bg-white/5 py-3 px-2 scrollbar-thin scrollbar-thumb-white/20"
          >
            {ordered.map((it, i) => {
              const active = i === idx;
              const src =
                cldThumb({ public_id: it.public_id, type: it.type, width: 220, height: 124 }) ||
                it.src;
              return (
                <button
                  key={it.public_id || i}
                  data-thumb={i}
                  onClick={() => setIdx(i)}
                  className={`relative inline-block mr-2 last:mr-0 rounded-lg overflow-hidden border transition
                    ${active ? "border-white shadow" : "border-white/10 hover:border-white/40"}`}
                  style={{ width: 220, height: 124 }}
                  aria-label={`Preview ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={it.alt || ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {it.type === "video" && (
                    <span className="absolute bottom-1 right-1 text-[10px] px-2 py-0.5 rounded bg-black/70">
                      VIDEO
                    </span>
                  )}
                </button>
              );
            })}

            {/* Skeletons on first load */}
            {loading && ordered.length === 0 &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="inline-block mr-2 w-[220px] h-[124px] rounded-lg bg-white/5 animate-pulse"
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
