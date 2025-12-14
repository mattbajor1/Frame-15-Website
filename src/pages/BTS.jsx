import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useCloudinaryAssets from "../hooks/useCloudinaryAssets";
import Heading from "../components/Heading"; // match Services heading

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

export default function BTS({
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

  // Measure stage for crisp sizing + provide intrinsic sizes
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
      {/* Heading (matches Services) */}
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
                  width={stageW}
                  height={stageH}
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
                  width={stageW}
                  height={stageH}
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
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur border border-white/20 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition disabled:opacity-0"
            aria-label="Previous"
          >
            <FiChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={next}
            disabled={idx === ordered.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur border border-white/20 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition disabled:opacity-0"
            aria-label="Next"
          >
            <FiChevronRight className="h-7 w-7" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="mt-8 relative">
          <div
            ref={railRef}
            className="relative w-full overflow-x-auto whitespace-nowrap py-4 scrollbar-hide"
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
                  className={`relative inline-block mr-3 last:mr-0 rounded-lg overflow-hidden border-2 transition-all duration-200 transform
                    ${active
                      ? "border-yellow-500 scale-105 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]"}`}
                  style={{ width: 200, height: 112 }}
                  aria-label={`Preview ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={it.alt || ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={112}
                  />
                  {it.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Skeletons on first load */}
            {loading && ordered.length === 0 &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="inline-block mr-3 w-[200px] h-[112px] rounded-lg bg-white/10 animate-pulse"
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
