"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Will it look like me?",
    a: "We build a private model from your photos and score every result for likeness. You see a free preview first — so you can judge before paying.",
  },
  {
    q: "What do I get for $29?",
    a: "40 headshots in 4K, your choice of 4 finals, and a PDF with 3 bios, 3 interview openers, and 10 keywords for your target role. No subscription.",
  },
  {
    q: "Do you keep my photos?",
    a: "No. Photos and results are deleted within 7 days. We never use them to train public models.",
  },
  {
    q: "How long does it take?",
    a: "The free preview takes a few minutes. The full set is usually ready in 3–8 minutes after payment.",
  },
  {
    q: "What if I’m not happy with the set?",
    a: "You get one free redo. We only issue a refund when generation fails — not for preference.",
  },
  {
    q: "Can I use them on LinkedIn?",
    a: "Yes. You get a personal commercial-use license for your own profiles and resumes.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[rgba(18,21,26,0.10)] border-y border-soft">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-medium text-ink">{item.q}</span>
              <span className="text-muted" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
