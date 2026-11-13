import { NextResponse } from "next/server";
import { listQueuedJobs } from "@/lib/db";
import { runJob } from "@/lib/pipeline/generate";

/** GET /api/cron/tick → {processed} */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const jobs = await listQueuedJobs(5);
  let processed = 0;
  const errors: string[] = [];

  for (const job of jobs) {
    try {
      await runJob(job.id);
      processed += 1;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "job failed");
    }
  }

  return NextResponse.json({ processed, errors });
}
