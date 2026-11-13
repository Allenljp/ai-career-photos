# AI Career Headshots

Upload 8 photos → free watermarked preview → unlock 40 4K headshots + role bio PDF for **$29** (one-time).

English market MVP. Stack: Next.js 14 (App Router) + TypeScript + Tailwind · Vercel · Supabase · Cloudflare R2 · fal.ai · Creem (mock first) · Resend.

## Local start (D1 free preview — no secrets required)

```bash
pnpm install
cp .env.example .env.local
# leave secrets empty for mock mode (in-memory DB + local file store + mock preview)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # serve production build
```

### Demo the free preview loop

1. Open `/upload`
2. Select 8+ JPG/PNG photos (short side ≥256px in mock; prefer ≥1024 in production)
3. Enter email, pick role, check consent
4. **Continue to free preview** → precheck → watermarked 512px + likeness score
5. Retry with the same browser: you should see `You've already claimed your free preview.`

Mock storage lives in process memory (and is served from `/api/mock-storage/*`). Restarting `pnpm dev` clears claims and uploads.

## Database

Apply `sql/schema.sql` in the Supabase SQL editor when you add `SUPABASE_*` (D2+). D1 uses an in-memory adapter automatically when those env vars are empty.

## Routes

| Path | Status |
|------|--------|
| `/` | Landing + `view_home` |
| `/upload` | Upload → sign → precheck → preview |
| `/preview/[orderId]` | Watermarked preview + score |
| `/generate/[orderId]` | Stub (D2) |
| `/deliver/[token]` | Stub (D2) |
| `/terms`, `/privacy` | Stub legal pages |
| `/api/*` | D1 contracts live; checkout/webhook stubbed |

## Milestone

- **D0**: scaffold + stubs
- **D1** (this): free preview loop with mocks when secrets missing
- **D2**: paid loop (mock pay → full gen → select → PDF → email)
- **D3**: cleanup cron, analytics, launch assets

## Notes

- No secrets in the repo — use `.env.local`
- Marketing pages do not promise refunds; Terms cover generation-failure cases only
- Package manager: **pnpm**
- Real FAL / R2 / Supabase plug in via env; interfaces are ready under `lib/providers` and `lib/r2.ts`
