import React, { useEffect, useMemo, useState } from "react";

/** Parse a Vimeo URL or ID and preserve query params like `h=` */
function parseVimeo(input) {
  if (!input) return { id: null, base: null, params: new URLSearchParams(), pageUrl: null };
  let id = null;
  const params = new URLSearchParams();

  try {
    const u = new URL(String(input));
    const m = u.pathname.match(/(?:\/video\/(\d+))|(?:\/(\d+))/);
    if (m) id = m[1] || m[2];
    for (const [k, v] of u.searchParams.entries()) params.set(k, v);
  } catch {
    id = String(input).match(/\d+/)?.[0] ?? null;
  }

  const base = id ? `https://player.vimeo.com/video/${id}` : null;
  const pageUrl = id
    ? `https://vimeo.com/${id}${params.has("h") ? `?h=${params.get("h")}` : ""}`
    : null;

  return { id, base, params, pageUrl };
}

/** Pluck the best poster from player config JSON */
function pickPosterFromConfig(cfg) {
  const thumbs = cfg?.video?.thumbs;
  if (thumbs && typeof thumbs === "object") {
    const pref = ["1920", "1280", "960", "640"];
    for (const k of pref) if (thumbs[k]) return thumbs[k];
    const vals = Object.values(thumbs);
    if (vals.length) return vals[0];
  }
  const sizes = cfg?.video?.pictures?.sizes;
  if (Array.isArray(sizes) && sizes.length) {
    const best = [...sizes].sort((a, b) => (b.width || 0) - (a.width || 0))[0];
    return best?.link || best?.link_with_play_button || null;
  }
  return null;
}

export default function VimeoLite({
  vimeo,                      // full URL (with ?h=...) or just the numeric ID
  title = "Vimeo video",
  aspect = 16 / 9,
  autoPlayOnClick = true,
  poster = null,              // optional custom poster URL (always preferred first if provided)
  showChromeDefaults = false, // true = keep Vimeo's title/byline/portrait defaults
}) {
  const { id, base, params, pageUrl } = useMemo(() => parseVimeo(vimeo), [vimeo]);

  const [active, setActive] = useState(false);

  // Poster handling
  const [candidates, setCandidates] = useState([]); // ordered list of possible poster URLs
  const [candIndex, setCandIndex] = useState(0);    // which candidate we're trying
  const [loaded, setLoaded] = useState(false);      // hide broken icon until an image truly loads

  // Build iframe src with all original params (incl. ?h=)
  const iframeSrc = useMemo(() => {
    if (!base) return null;
    const p = new URLSearchParams(params);
    if (autoPlayOnClick) p.set("autoplay", "1");
    if (!showChromeDefaults) {
      if (!p.has("title")) p.set("title", "0");
      if (!p.has("byline")) p.set("byline", "0");
      if (!p.has("portrait")) p.set("portrait", "0");
    }
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  }, [base, params, autoPlayOnClick, showChromeDefaults]);

  // Build candidate list: poster prop (if any) → config poster → oEmbed poster → vumbnail
  useEffect(() => {
    let cancelled = false;
    if (!id) return;

    const cacheKey = `vimeo_poster_${id}_${params.get("h") || ""}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const arr = JSON.parse(cached);
      setCandidates(arr);
      setCandIndex(0);
      setLoaded(false);
      return;
    }

    (async () => {
      const tryList = [];

      // 1) explicit poster override
      if (poster) tryList.push(poster);

      // 2) player config poster (most reliable for unlisted/private with h=)
      try {
        if (base) {
          const url = `${base}/config${params.has("h") ? `?h=${params.get("h")}` : ""}`;
          const res = await fetch(url, { mode: "cors" });
          if (res.ok) {
            const cfg = await res.json();
            const p = pickPosterFromConfig(cfg);
            if (p) tryList.push(p);
          }
        }
      } catch (_) {
        // ignore; move on
      }

      // 3) oEmbed poster (also respects h= via pageUrl)
      try {
        if (pageUrl) {
          const res = await fetch(
            `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(pageUrl)}&width=1280`
          );
          if (res.ok) {
            const data = await res.json();
            const p = data.thumbnail_url || data.thumbnail_url_with_play_button;
            if (p) tryList.push(p);
          }
        }
      } catch (_) {
        // ignore; move on
      }

      // 4) vumbnail fallback (public)
      tryList.push(`https://vumbnail.com/${id}.jpg`);

      // de-dupe while preserving order
      const uniq = [...new Set(tryList.filter(Boolean))];

      if (!cancelled) {
        setCandidates(uniq);
        setCandIndex(0);
        setLoaded(false);
        sessionStorage.setItem(cacheKey, JSON.stringify(uniq));
      }
    })();

    return () => { cancelled = true; };
  }, [id, base, pageUrl, params, poster]);

  // If we switch candidate URL, reset loaded
  useEffect(() => {
    setLoaded(false);
  }, [candIndex]);

  if (!id || !iframeSrc) return null;
  const paddingTop = `${100 / aspect}%`;
  const currentPoster = candidates[candIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-md bg-black" style={{ paddingTop }}>
      {!active ? (
        <>
          {/* Smooth gradient hides any broken icon until a poster truly loads */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-900 to-black" />

          {currentPoster && (
            <img
              src={currentPoster}
              alt=""
              style={{ opacity: loaded ? 1 : 0 }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              onError={() => {
                // Try the next candidate, or give up and keep the gradient
                setLoaded(false);
                setCandIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 grid place-items-center text-white/95 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label={`Play ${title}`}
            title={`Play ${title}`}
          >
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/30">
              ▶
            </span>
          </button>
        </>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={iframeSrc}
          title={title}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
}
