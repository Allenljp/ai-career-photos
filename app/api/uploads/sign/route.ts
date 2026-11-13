import { NextResponse } from "next/server";
import { signUploadUrls } from "@/lib/r2";

/** POST /api/uploads/sign — {count} → {keys[], uploadUrls[]} */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const count = Number(body?.count ?? 0);
  if (!Number.isFinite(count) || count < 1 || count > 10) {
    return NextResponse.json(
      { error: "count must be between 1 and 10" },
      { status: 400 },
    );
  }

  const signed = await signUploadUrls(count);
  return NextResponse.json(signed);
}
