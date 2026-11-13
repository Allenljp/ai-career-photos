"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Will it look like me?",
    a: "We train a private model on your photos and score every result for likeness. If we can't produce usable results, we refund automatically.",
  },
  {
    q: "What do I get for $29?",
    a: "40 headshots in 4K, your choice of 4 final images, and a PDF with 3 bios, 3 interview openers, and 10 keywords for your target role.",
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
    q: "What if I don't like the result?",
    a: "You get one free redo. We refund only when generation fails.",
  },
  {
    q: "Can I use them on LinkedIn?",
    a: "Yes — a personal, commercial-use license for your own profiles and resumes.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[rgba(0,0,0,0.08)] rounded-2xl border border-soft bg-white">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-medium text-ink">{item.q}</span>
              <span className="text-muted" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
