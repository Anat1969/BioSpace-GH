import ActHeader from "./ActHeader";

/**
 * One conceptual stage. Renders an anchored <section> (the id doubles as the
 * ProgressNav target), an optional living gradient mesh, the act header, and
 * the stage's modules as children.
 */
export default function StorySection({ act, mesh = false, children }) {
  return (
    <section
      id={act.id}
      dir="rtl"
      className="relative scroll-mt-24 py-24 md:py-32 border-t border-border overflow-hidden"
    >
      {mesh && (
        <div className="absolute inset-0 pointer-events-none opacity-70 animate-mesh-drift bg-[radial-gradient(35%_45%_at_15%_20%,hsl(var(--bio)/0.10),transparent_70%),radial-gradient(40%_50%_at_85%_80%,hsl(var(--accent)/0.10),transparent_70%)]" />
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-20">
        <ActHeader num={act.num} kicker={act.kicker} title={act.title} bridge={act.bridge} />
        {children}
      </div>
    </section>
  );
}

/**
 * Hairline module grid — mirrors the original gap-px look so cards read as one
 * connected instrument panel. `full` children span both columns.
 */
export function ModuleGrid({ children, cols = "md:grid-cols-2" }) {
  return <div className={`grid grid-cols-1 ${cols} gap-px bg-border`}>{children}</div>;
}

export function ModuleCell({ full = false, children }) {
  return <div className={`bg-background ${full ? "col-span-1 md:col-span-2" : ""}`}>{children}</div>;
}
