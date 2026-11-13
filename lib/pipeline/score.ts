/**
 * Likeness score 0–100.
 * Build doc §8: round(similarity×70 + sharpness×30)
 * similarity & sharpness expected in 0–1.
 */
export function scorePreview(similarity: number, sharpness: number): number {
  const sim = clamp01(similarity);
  const sharp = clamp01(sharpness);
  return Math.round(sim * 70 + sharp * 30);
}

export function scoreExplanation(score: number): string {
  if (score >= 80) {
    return "Strong likeness. Your full set upgrades to 4K and adds your role-specific bio pack.";
  }
  if (score >= 60) {
    return "Decent match. For better results, add 2 sharper photos — or continue anyway.";
  }
  return "We're not confident this looks like you. Retake 2-3 photos in daylight.";
}

export function bioTipForRole(role: string): string {
  const r = role || "Professional";
  return `Lead with a calm, confident ${r.toLowerCase()} presence — keep your headline under 80 characters and mirror language from the job post.`;
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
