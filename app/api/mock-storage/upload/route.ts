import { NextResponse } from "next/server";
import { verifySignedStorageRequest } from "@/lib/auth";
import { putObject } from "@/lib/r2";

/** PUT /api/mock-storage/upload?key=&orderId=&exp=&sig= — signed order-bound upload */
export async function PUT(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const orderId = url.searchParams.get("orderId");
  const exp = url.searchParams.get("exp");
  const sig = url.searchParams.get("sig");

  const verified = verifySignedStorageRequest({
    method: "PUT",
    key: key || "",
    orderId,
    exp,
    sig,
  });
  if (!verified.ok) {
    return NextResponse.json(
      { error: verified.error },
      { status: verified.status },
    );
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

  const contentType =
    request.headers.get("content-type") || "application/octet-stream";
  await putObject(key!, buf, contentType);
  return NextResponse.json({ ok: true, key, bytes: buf.byteLength });
}

export async function POST(request: Request) {
  return PUT(request);
}
