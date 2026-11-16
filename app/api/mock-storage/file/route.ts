import { NextResponse } from "next/server";
import { verifySignedStorageRequest } from "@/lib/auth";
import { getObject } from "@/lib/r2";

/** GET /api/mock-storage/file?key=&orderId=&exp=&sig= — signed order-bound read */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const orderId = url.searchParams.get("orderId");
  const exp = url.searchParams.get("exp");
  const sig = url.searchParams.get("sig");

  const verified = verifySignedStorageRequest({
    method: "GET",
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

  const buf = await getObject(key!);
  if (!buf) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const lower = key!.toLowerCase();
  let contentType = "application/octet-stream";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
    contentType = "image/jpeg";
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
