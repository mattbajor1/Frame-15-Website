// src/components/JustifiedGallery.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/** Build a Cloudinary URL (no secrets needed). */
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
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, // public var; set this!
}) {
  const ref = useRef(null);
  const [W, setW] = useState(1200);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      setW(Math.max(0, Math.floor(entries[0].contentRect.width)));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const boxes = useMemo(
    () => layout(items, W, targetRowHeight, gutter, heroEvery, heroHeight),
    [items, W, targetRowHeight, gutter, heroEvery, heroHeight]
  );

  const dpr = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1.5;

  return (
    <div
      ref={ref}
      data-gallery="justified"
      className={className}
      style={{ position: "relative", height: boxes.containerHeight, width: "100%" }}
    >
      {boxes.tiles.map((t) => {
        const it = items[t.index];

        // If cloudName is available, ask Cloudinary for a crisp, per-tile size.
        // Otherwise fall back to whatever src the server gave us.
        let src;
        if (cloudName && it.public_id) {
          const reqW = Math.round(t.width * dpr);
          const reqH = Math.round(t.height * dpr);
          src = cldUrl({
            cloudName,
            public_id: it.public_id,
            type: it.type,
            width: reqW,
            height: reqH,
            mode: "fill",
          });
        } else {
          src = it.src; // fallback (will look like before)
        }

        return (
          <figure
            key={t.key}
            onClick={() => onItemClick?.(t.index)}
            className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm cursor-zoom-in"
            style={{
              position: "absolute",
              top: t.top, left: t.left, width: t.width, height: t.height,
            }}
          >
            <img
              src={src}
              alt={it.alt || ""}
              loading={t.index < 8 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </figure>
        );
      })}
    </div>
  );
}

/** Flickr-style justified layout with optional full-bleed hero rows */
function layout(items, containerWidth, targetRowHeight, gutter, heroEvery, heroHeight) {
  if (!items?.length || containerWidth <= 0) return { tiles: [], containerHeight: 0 };

  const tiles = [];
  let y = 0;
  let row = [];
  let arSum = 0;
  let rowCount = 0;

  const getAR = (it) => {
    const w = it.width || 1600;
    const h = it.height || 1000;
    return Math.max(0.25, Math.min(4, w / h));
  };

  let i = 0;
  while (i < items.length) {
    // optional hero row
    if (heroEvery > 0 && row.length === 0 && rowCount > 0 && rowCount % heroEvery === 0) {
      tiles.push({ index: i, key: `hero-${i}`, top: y, left: 0, width: containerWidth, height: heroHeight });
      y += heroHeight + gutter;
      rowCount++;
      i++;
      continue;
    }

    const ar = getAR(items[i]);
    row.push({ index: i, ar });
    arSum += ar;

    const innerW = containerWidth - gutter * (row.length - 1);
    const h = innerW / arSum;

    if (h <= targetRowHeight * 1.25 || i === items.length - 1) {
      const height = Math.max(140, Math.min(targetRowHeight * 1.25, h));
      let x = 0;
      row.forEach((r, j) => {
        const w = r.ar * height;
        tiles.push({
          index: r.index,
          key: `tile-${r.index}`,
          top: y,
          left: x,
          width: j === row.length - 1 ? (containerWidth - x) : w, // stretch last tile to avoid hairline gaps
          height,
        });
        x += w + gutter;
      });
      y += height + gutter;
      row = [];
      arSum = 0;
      rowCount++;
    }
    i++;
  }

  return { tiles, containerHeight: Math.max(0, y - gutter) };
}
