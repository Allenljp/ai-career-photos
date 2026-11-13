import { NextResponse } from "next/server";

/** POST /api/uploads/sign — {count} → {keys[], uploadUrls[]} */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const count = Number(body?.count ?? 0);

  return NextResponse.json({
    keys: Array.from({ length: count }, (_, i) => `stub/upload-${i}`),
    uploadUrls: Array.from({ length: count }, () => null),
    stub: true,
  });
}
