import { NextResponse } from "next/server";
import { getObject } from "@/lib/r2";

/** GET /api/mock-storage/file?key=... — serve mock uploaded / preview bytes */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }

  const buf = await getObject(key);
  if (!buf) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const lower = key.toLowerCase();
  let contentType = "application/octet-stream";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
  else if (lower.endsWith(".png")) contentType = "image/png";
  else if (lower.endsWith(".webp")) contentType = "image/webp";

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
}
