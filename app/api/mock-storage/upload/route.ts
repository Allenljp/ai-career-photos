import { NextResponse } from "next/server";
import { putObject } from "@/lib/r2";

/** PUT /api/mock-storage/upload?key=... — mock R2 signed upload */
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }

  const ab = await request.arrayBuffer();
  const buf = Buffer.from(ab);
  if (buf.byteLength === 0) {
    return NextResponse.json({ error: "empty body" }, { status: 400 });
  }
  if (buf.byteLength > 20 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Each photo must be under 20 MB." },
      { status: 413 },
    );
  }

  const contentType = request.headers.get("content-type") || "application/octet-stream";
  await putObject(key, buf, contentType);
  return NextResponse.json({ ok: true, key, bytes: buf.byteLength });
}

export async function POST(request: Request) {
  return PUT(request);
}
