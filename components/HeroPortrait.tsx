/** Dominant hero visual plane — studio placeholder until real generations ship. */
export function HeroPortrait() {
  return (
    <div
      className="relative h-full min-h-[320px] w-full overflow-hidden sm:min-h-[440px] lg:min-h-full"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 52% 30%, #eef3f4 0%, #c9d3db 38%, #9eabb8 72%, #7a8794 100%)",
        }}
      />
      {/* Soft key light + floor falloff */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 38% 22%, rgba(255,255,255,0.55) 0%, transparent 42%), linear-gradient(180deg, transparent 48%, rgba(18,21,26,0.22) 100%)",
        }}
      />
      {/* Abstract headshot silhouette — no fake face detail */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 760"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#e2d4c6" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#cbb6a4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a89280" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#31454e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1b272d" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="cheek" cx="35%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="730" rx="240" ry="175" fill="url(#shirt)" />
        <ellipse cx="300" cy="295" rx="122" ry="146" fill="url(#skin)" />
        <ellipse cx="268" cy="280" rx="70" ry="90" fill="url(#cheek)" />
        <path
          d="M178 292 C188 205 232 148 300 142 C368 148 412 205 422 292 C402 248 348 226 300 228 C252 226 198 248 178 292Z"
          fill="#243038"
          opacity="0.5"
        />
      </svg>
      <div className="studio-grain opacity-45" />
    </div>
  );
}
