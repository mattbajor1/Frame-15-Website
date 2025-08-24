// src/components/JustifiedGallery.jsx
import React, { useEffect, useMemo, useRef } from "react";

// Build Cloudinary URL (public-only)
function cldUrl({ cloudName, public_id, type = "image", width, height, mode = "fill" }) {
  const rt = type === "video" ? "video" : "image";
  const crop = mode === "limit" ? "c_limit" : "c_fill";
  const w = width ? `,w_${Math.round(width)}` : "";
  const h = height ? `,h_${Math.round(height)}` : "";
  return `https://res.cloudinary.com/${cloudName}/${rt}/upload/f_auto,q_auto,g_auto,${crop}${w}${h}/${public_id}`;
}

/**
 * Justified gallery (no gaps) with optional hero rows.
 * items: { public_id, type, width, height, alt, src }
 */
export default function JustifiedGallery({
  items,
  onItemClick,
  targetRowHeight = 320,
  gutter = 16,
  heroEvery = 0,          // 0 = off; e.g. 6 => every 6th row is full-bleed
  heroHeight = 520,
  className = "",
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
}) {
  const containerRef = useRef(null);

  const layout = useMemo(() => {
    return computeLayout(items, targetRowHeight, gutter, heroEvery, heroHeight);
  }, [items, targetRowHeight, gutter, heroEvery, heroHeight]);

  // set container height to avoid reflow
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.height = `${layout.containerHeight}px`;
  }, [layout.containerHeight]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: layout.containerHeight }}>
      {layout.tiles.map((t, i) => {
        const src =
          (t.public_id &&
            cldUrl({
              cloudName,
              public_id: t.public_id,
              type: t.type,
              width: t.width * 1.25,
              height: t.height * 1.25,
              mode: "fill",
            })) ||
          t.src;

        return (
          <button
            key={t.key}
            className="absolute overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm cursor-zoom-in group"
            style={{ left: t.left, top: t.top, width: t.width, height: t.height }}
            onClick={() => onItemClick?.(t.index)}
            aria-label="Open image"
          >
            <img
              src={src}
              alt={t.alt || ""}
              loading={t.index < 8 ? "eager" : "lazy"}
              decoding="async"
              width={Math.round(t.width)}     // intrinsic size to reduce CLS
              height={Math.round(t.height)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        );
      })}
    </div>
  );
}

function computeLayout(items, targetRowHeight, gutter, heroEvery, heroHeight) {
  const tiles = [];
  let y = 0;
  let row = [];
  let arSum = 0;
  let rowCount = 0;

  const flushRow = (isLast = false) => {
    if (row.length === 0) return;
    const containerWidth = typeof window !== "undefined" ? Math.min(1400, document.body.clientWidth - 64) : 1200;

    // hero row?
    if (heroEvery > 0 && (rowCount + 1) % heroEvery === 0 && !isLast) {
      const h = heroHeight;
      let x = 0;
      row.forEach((r) => {
        const w = (r.w / r.h) * h;
        tiles.push({
          key: r.key,
          index: r.index,
          public_id: r.public_id,
          type: r.type,
          alt: r.alt,
          left: x,
          top: y,
          width: Math.min(containerWidth, w),
          height: h,
        });
        x += w + gutter;
      });
      y += h + gutter;
      row = [];
      arSum = 0;
      rowCount++;
      return;
    }

    const availableW = containerWidth - gutter * (row.length - 1);
    const h = Math.max(120, Math.min(targetRowHeight * (availableW / (arSum * targetRowHeight)), targetRowHeight * 1.35));
    let x = 0;
    row.forEach((r) => {
      const w = (r.w / r.h) * h;
      tiles.push({
        key: r.key,
        index: r.index,
        public_id: r.public_id,
        type: r.type,
        alt: r.alt,
        left: x,
        top: y,
        width: w,
        height: h,
      });
      x += w + gutter;
    });
    y += h + gutter;
    row = [];
    arSum = 0;
    rowCount++;
  };

  items.forEach((it, i) => {
    const w = it.width || 1600;
    const h = it.height || 900;
    const ar = w / h;
    row.push({ key: it.public_id || it.src || i, index: i, public_id: it.public_id, type: it.type, alt: it.alt, w, h });
    arSum += ar;

    const containerWidth = typeof window !== "undefined" ? Math.min(1400, document.body.clientWidth - 64) : 1200;
    const estimatedW = arSum * targetRowHeight + gutter * (row.length - 1);
    if (estimatedW > containerWidth && row.length > 1) {
      flushRow();
    }
  });

  flushRow(true);

  return { tiles, containerHeight: Math.max(0, y - gutter) };
}
