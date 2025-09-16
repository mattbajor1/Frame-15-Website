// src/components/JustifiedGallery.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// Build Cloudinary URL (public-only)
function cldUrl({ cloudName, public_id, type = "image", width, height, mode = "fill" }) {
  const rt = type === "video" ? "video" : "image";
  const crop = mode === "limit" ? "c_limit" : "c_fill";
  const w = width ? `,w_${Math.round(width)}` : "";
  const h = height ? `,h_${Math.round(height)}` : "";
  return `https://res.cloudinary.com/${cloudName}/${rt}/upload/f_auto,q_auto,g_auto,${crop}${w}${h}/${public_id}`;
}

/**
 * Compute justified rows into tiles that exactly fill `containerWidth`.
 * items: [{ public_id, type, width, height, alt, src }]
 */
function computeLayout(items, containerWidth, targetRowHeight, gutter) {
  if (!containerWidth || containerWidth <= 0) {
    return { tiles: [], containerHeight: 0 };
  }

  const W = Math.max(0, Math.floor(containerWidth));

  const tiles = [];
  let row = [];
  let arSum = 0;
  let y = 0;

  const flushRow = (isLast = false) => {
    if (!row.length) return;
    const h = isLast
      ? targetRowHeight
      : (W - gutter * (row.length - 1)) / arSum;

    let x = 0;
    row.forEach((it, idx) => {
      const w = Math.round(h * (it.w / it.h));
      tiles.push({
        key: it.key,
        public_id: it.public_id,
        type: it.type,
        alt: it.alt,
        left: x,
        top: y,
        width: w,
        height: Math.round(h),
      });
      x += w + gutter;
    });
    y += Math.round(h) + gutter;
    row = [];
    arSum = 0;
  };

  items.forEach((it, i) => {
    const w = Math.max(1, Number(it.width || it.w || 1600));
    const h = Math.max(1, Number(it.height || it.h || 900));
    const ar = w / h;

    row.push({
      key: it.public_id || it.src || i,
      public_id: it.public_id,
      type: it.type,
      alt: it.alt,
      w,
      h,
    });
    arSum += ar;

    const estimatedRowWidth = arSum * targetRowHeight + gutter * (row.length - 1);
    if (estimatedRowWidth > W && row.length > 1) {
      flushRow(false);
    }
  });

  flushRow(true);

  return { tiles, containerHeight: Math.max(0, y - gutter) };
}

export default function JustifiedGallery({
  items = [],
  onItemClick,
  targetRowHeight = 320,
  gutter = 16,
  heroEvery = 0,     // kept for API compatibility (unused)
  heroHeight = 520,  // kept for API compatibility (unused)
  className = "",
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  // Measure actual gallery width
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(
    () => computeLayout(items, width, targetRowHeight, gutter),
    [items, width, targetRowHeight, gutter]
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `${layout.containerHeight}px`;
    }
  }, [layout.containerHeight]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height: layout.containerHeight }}>
      {layout.tiles.map((t, i) => {
        const src =
          t.public_id && cloudName
            ? cldUrl({ cloudName, public_id: t.public_id, type: items[i]?.type, width: t.width, height: t.height })
            : items[i]?.src;

        return (
          <button
            key={t.key}
            type="button"
            className="absolute block overflow-hidden rounded-xl bg-neutral-100 focus:outline-none"
            style={{ left: t.left, top: t.top, width: t.width, height: t.height }}
            onClick={() => onItemClick && onItemClick(t.index ?? i)}
            aria-label="Open image"
          >
            <img
              src={src}
              alt={items[i]?.alt || ""}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        );
      })}
    </div>
  );
}
