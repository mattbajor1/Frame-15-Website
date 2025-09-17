// netlify/functions/cloudinary-list.mjs
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ok = (body) => ({ statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const err = (status, message) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: message }) });

export const handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const folder = (qs.folder || "").trim();
    if (!folder) return err(400, "Missing ?folder");

    const includeSubfolders = String(qs.includeSubfolders ?? "true") === "true";
    const pageSize = Math.min(parseInt(qs.pageSize || "48", 10) || 48, 500);
    const nextCursor = qs.nextCursor || null;
    const types = (qs.types || "image").trim(); // "image" | "video" | "image,video"

    // If only one type, use Admin API resources+prefix (fast, simple, includes subfolders by prefix).
    const typeList = types.split(",").map((t) => t.trim()).filter(Boolean);

    if (typeList.length === 1) {
      const resource_type = typeList[0]; // "image" or "video"
      // prefix that includes subfolders
      const prefix = includeSubfolders ? `${folder}/` : `${folder}/`;
      // NOTE: Admin API with prefix always includes subfolders; to emulate "no subfolders",
      // we filter client-side below when includeSubfolders=false.

      const res = await cloudinary.v2.api.resources({
        type: "upload",
        resource_type,
        prefix,
        max_results: pageSize,
        next_cursor: nextCursor || undefined,
      });

      let items = (res.resources || []).map((r) => ({
        public_id: r.public_id,
        type: r.resource_type,
        width: r.width,
        height: r.height,
        created_at: r.created_at,
        format: r.format,
        secure_url: r.secure_url,
        folder: r.folder, // e.g., "Frame 15 Photos/sub"
      }));

      if (!includeSubfolders) {
        // Keep only exact folder (no deeper slashes after the folder name)
        const base = folder.replace(/\/+$/, "");
        items = items.filter((it) => it.folder === base);
      }

      // Sort newest first to match typical expectations
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return ok({
        items,
        nextCursor: res.next_cursor || null,
        hasMore: Boolean(res.next_cursor),
      });
    }

    // If you requested multiple resource types, use the Search API.
    const exprTypes = typeList.map((t) => `resource_type:${t}`).join(" OR ");
    const folderExpr = includeSubfolders ? `folder="${folder}/*"` : `folder="${folder}"`;
    const expression = `(${exprTypes}) AND ${folderExpr}`;

    const res = await cloudinary.v2.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .with_field("context")
      .max_results(pageSize)
      .next_cursor(nextCursor || undefined)
      .execute();

    const items = (res.resources || []).map((r) => ({
      public_id: r.public_id,
      type: r.resource_type,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
      format: r.format,
      secure_url: r.secure_url,
      folder: r.folder,
    }));

    return ok({
      items,
      nextCursor: res.next_cursor || null,
      hasMore: Boolean(res.next_cursor),
    });
  } catch (e) {
    console.error(e);
    return err(500, e.message || "Cloudinary list failed");
  }
};
