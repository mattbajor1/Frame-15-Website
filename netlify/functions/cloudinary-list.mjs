// netlify/functions/cloudinary-list.mjs
import { v2 as cloudinary } from "cloudinary";

// Parse CLOUDINARY_URL if present (cloudinary://KEY:SECRET@CLOUD_NAME)
function parseCloudinaryUrl(url) {
  try {
    const u = new URL(url);
    return { cloud_name: u.hostname, api_key: u.username, api_secret: u.password };
  } catch {
    return {};
  }
}

const parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL || "");

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.VITE_CLOUDINARY_CLOUD_NAME || // ok to be public; not a secret
    parsed.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY || parsed.api_key,
  api_secret: process.env.CLOUDINARY_API_SECRET || parsed.api_secret,
  secure: true,
});

export async function handler(event) {
  try {
    if (!cloudinary.config().cloud_name) {
      // No secret values logged
      console.error("Cloudinary config missing: no cloud_name.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Cloudinary is not configured (missing env vars)." }),
      };
    }

    const p = event.queryStringParameters || {};
    const folder = p.folder || "Frame 15 Photos";
    const includeSub = (p.include_subfolders || "false") === "true";
    const max = parseInt(p.max_results || "40", 10);
    const types = (p.types || "image").toLowerCase(); // 'image' | 'video' | 'all'
    const sort = p.sort || "created_at";              // 'created_at' | 'public_id'
    const order = p.order || "desc";                  // 'asc' | 'desc'
    const next = p.next_cursor;

    // ✅ Correct Cloudinary Search syntax (no quotes around resource_type)
    let expr = `folder="${folder}${includeSub ? "/*" : ""}"`;
    if (types === "image") expr += " AND resource_type:image";
    if (types === "video") expr += " AND resource_type:video";
    // if 'all' → no resource_type filter (returns any)

    let search = cloudinary.search
      .expression(expr)
      .with_field("context")
      .with_field("tags")
      .sort_by(sort, order)
      .max_results(max);

    if (next) search = search.next_cursor(next);

    const result = await search.execute();

    const widths = [480, 768, 1200, 1600, 2000];
    const items = result.resources.map((r) => {
      const isVideo = r.resource_type === "video";

      const src = cloudinary.url(r.public_id, {
        resource_type: isVideo ? "video" : "image",
        transformation: [
          { width: 1200, crop: "fill", gravity: "auto" },
          { fetch_format: "auto", quality: "auto" },
        ],
      });

      const srcSet = !isVideo
        ? widths
            .map(
              (w) =>
                `${cloudinary.url(r.public_id, {
                  resource_type: "image",
                  transformation: [
                    { width: w, crop: "fill", gravity: "auto" },
                    { fetch_format: "auto", quality: "auto" },
                  ],
                })} ${w}w`
            )
            .join(", ")
        : null;

      const alt = r.context?.custom?.alt || r.public_id.split("/").pop().replace(/[-_]/g, " ");

      return {
        id: r.asset_id,
        public_id: r.public_id,
        type: r.resource_type, // 'image' | 'video'
        src,
        srcSet,
        alt,
        created_at: r.created_at,
        width: r.width,
        height: r.height,
        videoUrl: isVideo
          ? cloudinary.url(r.public_id, {
              resource_type: "video",
              transformation: [{ width: 1600, crop: "limit" }, { fetch_format: "auto", quality: "auto" }],
            })
          : null,
      };
    });

    return {
      statusCode: 200,
      headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=86400" },
      body: JSON.stringify({ items, next_cursor: result.next_cursor || null, count: items.length }),
    };
  } catch (err) {
    const msg = err?.error?.message || err?.message || "unknown";
    console.error("Cloudinary search error:", msg);
    return { statusCode: 500, body: JSON.stringify({ error: "Cloudinary search failed." }) };
  }
}