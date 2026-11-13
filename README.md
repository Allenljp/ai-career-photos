# AI Career Headshots

Upload 8 photos → free watermarked preview → unlock 40 4K headshots + role bio PDF for **$29** (one-time).

English market MVP. Stack: Next.js 14 (App Router) + TypeScript + Tailwind · Vercel · Supabase · Cloudflare R2 · fal.ai · Creem (mock first) · Resend.

## Local start

```bash
pnpm install
cp .env.example .env.local
# fill values when ready; D0 pages work without secrets
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build   # production build
pnpm start   # serve production build
```

## Database

Apply `sql/schema.sql` in the Supabase SQL editor (tables: orders, uploads, jobs, assets, events, rate_limits).

## Routes (D0)

| Path | Status |
|------|--------|
| `/` | Landing (product copy) |
| `/upload` | Upload shell |
| `/preview/[orderId]` | Stub |
| `/generate/[orderId]` | Stub |
| `/deliver/[token]` | Stub |
| `/terms`, `/privacy` | Stub legal pages |
| `/api/*` | Contract stubs (§7) |

## Milestone

- **D0** (this branch): scaffold + stubs
- **D1**: free preview loop (sign → precheck → fal preview → watermark → score)
- **D2**: paid loop (mock pay → full gen → select → PDF → email)
- **D3**: cleanup cron, analytics, launch assets

## Notes

- No secrets in the repo — use `.env.local`
- Marketing pages do not promise refunds; Terms cover generation-failure cases only
- Package manager: **pnpm**
