"use client";

import { useEffect, useRef } from "react";

/**
 * Adds the "revealed" class to descendant `.reveal` elements as they scroll into view.
 * Returns a ref to attach to the section/root you want observed.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    // Fallback: if IntersectionObserver is unavailable, reveal everything.
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
