import { useEffect, useRef, useState } from "react";

/**
 * Loads Cloudinary search results page-by-page from your Netlify function.
 * - Guards against React StrictMode double-mount
 * - Prevents concurrent requests & reusing the same cursor
 * - De-dupes by public_id+type across pages
 */
export default function useCloudinaryAssets({
  folder = "Frame 15 Photos",
  types = "image",            // 'image' | 'video' | 'all'
  includeSubfolders = false,
  pageSize = 40,
} = {}) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- StrictMode / de-dupe guards ---
  const initRef = useRef(false);             // avoid double initial fetch in dev
  const seenRef = useRef(new Set());         // public_id:type -> true
  const inflightRef = useRef(false);         // prevent concurrent fetches
  const lastCursorRef = useRef(undefined);   // prevent fetching same cursor twice

  function makeKey(it) {
    // public_id is globally unique per resource type; add type for safety
    return `${it.public_id || it.id || it.src}|${it.type || "image"}`;
  }

  async function fetchPage(cursor) {
    if (inflightRef.current) return;
    if (cursor === lastCursorRef.current) return; // same page: ignore

    inflightRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        folder,
        types,
        include_subfolders: includeSubfolders ? "true" : "false",
        max_results: String(pageSize),
      });
      if (cursor) qs.set("next_cursor", cursor);

      const res = await fetch(`/.netlify/functions/cloudinary-list?${qs.toString()}`);
      if (!res.ok) throw new Error(`Cloudinary list failed: ${res.status}`);

      const data = await res.json();
      const fresh = (data.items || []).filter((it) => {
        const k = makeKey(it);
        if (seenRef.current.has(k)) return false;
        seenRef.current.add(k);
        return true;
      });

      setItems((prev) => (cursor ? [...prev, ...fresh] : fresh));
      lastCursorRef.current = data.next_cursor || null;
      setNextCursor(data.next_cursor || null);
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      inflightRef.current = false;
      setLoading(false);
    }
  }

  // Initial load + reload on key params change
  useEffect(() => {
    // reset state
    setItems([]);
    setNextCursor(null);
    setError(null);
    seenRef.current.clear();
    lastCursorRef.current = undefined;

    // StrictMode: ensure we only kick one initial fetch
    if (initRef.current) {
      initRef.current = false; // reset for subsequent prop changes
    }
    initRef.current = true;
    fetchPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, types, includeSubfolders, pageSize]);

  return {
    items,
    loading,
    error,
    hasMore: Boolean(nextCursor),
    loadMore: () => fetchPage(nextCursor),
  };
}
