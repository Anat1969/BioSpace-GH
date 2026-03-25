const LINKS = [
  { label: "מחקר", sub: "Research" },
  { label: "פלטפורמה", sub: "Platform" },
  { label: "אודות", sub: "About" },
  { label: "צור קשר", sub: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20" dir="rtl">
      <div className="max-w-6xl mx-auto px-8 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-end">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-5 border border-primary/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-accent" />
              </div>
              <span className="font-frank text-lg font-bold text-foreground tracking-tight">BioSpace</span>
            </div>
            <p className="font-heebo text-sm text-muted-foreground font-light leading-[1.8] max-w-sm">
              פלטפורמת מחקר לאנדוקרינולוגיה אדריכלית. מחברים בין ביולוגיה, מרחב, ובינוי.
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-row flex-wrap gap-8 items-start">
            {LINKS.map(l => (
              <div key={l.label} className="flex flex-col gap-0.5">
                <button className="font-heebo text-sm text-foreground/70 hover:text-foreground transition-colors text-right">
                  {l.label}
                </button>
                <span className="text-[9px] text-muted-foreground/40 tracking-wider font-heebo">{l.sub}</span>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between mt-14 pt-8 border-t border-border flex-wrap gap-4">
          <p className="text-[10px] text-muted-foreground/40 font-heebo">
            © 2026 BioSpace Research. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-moss-pulse" />
            <span className="text-[10px] text-muted-foreground/40 font-heebo tracking-wide">Research active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}