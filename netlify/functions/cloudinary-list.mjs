// netlify/functions/cloudinary-list.mjs
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const json = (code, body) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const folder = (qs.folder || "").trim();
    const includeSubfolders = String(qs.includeSubfolders ?? "true") === "true";
    const pageSize = Math.min(parseInt(qs.pageSize || "48", 10) || 48, 500);
    const nextCursor = qs.nextCursor || null;
    const resourceTypes = (qs.resourceTypes || qs.types || "image") // allow old param name "types"
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean); // e.g. ["image"] or ["image","video"]

    // Quick sanity checks to avoid opaque 500s
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return json(400, { error: "Missing env: CLOUDINARY_CLOUD_NAME" });
    }
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return json(400, { error: "Missing env: CLOUDINARY_API_KEY and/or CLOUDINARY_API_SECRET" });
    }
    if (!folder) return json(400, { error: "Missing ?folder" });

    // Helper: list one resource_type via Admin API with prefix (includes subfolders)
    const listOne = async (resource_type) => {
      const res = await cloudinary.v2.api.resources({
        type: "upload",             // delivery type
        resource_type,              // "image" or "video"
        prefix: `${folder}/`,       // includes subfolders
        max_results: pageSize,
        next_cursor: nextCursor || undefined,
      });
      let items = (res.resources || []).map((r) => ({
        public_id: r.public_id,
        type: r.resource_type,      // "image" | "video"
        width: r.width,
        height: r.height,
        created_at: r.created_at,
        format: r.format,
        secure_url: r.secure_url,
        folder: r.folder,           // "Folder/Sub"
      }));
      if (!includeSubfolders) {
        const base = folder.replace(/\/+$/, "");
        items = items.filter((it) => it.folder === base);
      }
      return { items, nextCursor: res.next_cursor || null };
    };

    // Combine results if multiple resource types requested (rare for your case)
    const out = { items: [], nextCursor: null, hasMore: false };
    for (const rt of resourceTypes) {
      const r = await listOne(rt);
      out.items.push(...r.items);
      // If any type has a next cursor, expose it.
      out.nextCursor = r.nextCursor || out.nextCursor;
      out.hasMore = out.hasMore || Boolean(r.nextCursor);
    }

    // Sort newest first
    out.items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return json(200, out);
  } catch (e) {
    console.error("[cloudinary-list] failure:", e?.response?.body || e);
    const message =
      (e?.response?.body && typeof e.response.body === "object" && e.response.body.error?.message) ||
      e?.message ||
      "Cloudinary list failed";
    const http = e?.http_code || e?.response?.statusCode || 500;
    // Return the detailed message so the client can display it
    return json(http, { error: message });
  }
};
