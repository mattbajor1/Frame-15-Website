// src/hooks/useCloudinaryAssets.js
import { useCallback, useEffect, useRef, useState } from "react";

export default function useCloudinaryAssets({
  folder,
  pageSize = 48,
  includeSubfolders = true,
  types = "image", // or "image,video"
} = {}) {
  const [items, setItems] = useState([]);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // reset when inputs change
  useEffect(() => {
    setItems([]);
    setNext(null);
    setHasMore(true);
    setError(null);
  }, [folder, pageSize, includeSubfolders, types]);

  const inflight = useRef(false);

  const loadMore = useCallback(async () => {
    if (inflight.current || loading || !hasMore) return;
    inflight.current = true;
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        folder,
        pageSize: String(pageSize),
        includeSubfolders: String(includeSubfolders),
        types,
      });
      if (next) qs.set("nextCursor", next);

      const res = await fetch(`/.netlify/functions/cloudinary-list?${qs.toString()}`);
      if (!res.ok) throw new Error(`Cloudinary list failed (${res.status})`);
      const data = await res.json();

      const newItems = (data.items || []).map((r) => ({
        public_id: r.public_id,
        type: r.type,
        width: r.width,
        height: r.height,
        src: r.secure_url, // fallback src if you want to use direct url
        alt: "",
      }));

      setItems((prev) => [...prev, ...newItems]);
      setNext(data.nextCursor || null);
      setHasMore(Boolean(data.nextCursor));
      setError(null);
    } catch (e) {
      setError(e.message || String(e));
      setHasMore(false);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [folder, pageSize, includeSubfolders, types, next, loading, hasMore]);

  // initial load
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  return { items, loading, error, hasMore, loadMore };
}
