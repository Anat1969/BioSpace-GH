import { useEffect, useState } from "react";

/**
 * Sticky side navigator for the conceptual journey. Tracks the active act via
 * IntersectionObserver and lets the visitor jump between stages. Hidden on
 * small screens (where the linear scroll is enough).
 */
export default function ProgressNav({ acts }) {
  const [active, setActive] = useState(acts[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    const els = acts
      .map((a) => document.getElementById(a.id))
      .filter(Boolean);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [acts]);

  return (
    <nav
      dir="rtl"
      aria-label="ניווט בין שלבי המסע"
      className="hidden lg:flex flex-col gap-3.5 fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-40"
    >
      {acts.map((a) => {
        const on = active === a.id;
        return (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="group flex items-center gap-3 justify-end"
          >
            <span
              className={`font-heebo text-[11px] whitespace-nowrap transition-all duration-300 ${
                on ? "text-foreground opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {a.title}
            </span>
            <span
              className={`h-px transition-all duration-300 ${
                on ? "w-9 bg-accent" : "w-4 bg-border group-hover:w-6 group-hover:bg-muted-foreground"
              }`}
            />
            <span
              className={`font-frank text-[10px] tabular-nums w-4 text-center transition-colors duration-300 ${
                on ? "text-accent" : "text-muted-foreground/50"
              }`}
            >
              {a.num}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
