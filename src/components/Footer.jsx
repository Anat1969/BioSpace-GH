const LINKS = ["אודות", "מחקר", "צור קשר", "תנאי שימוש"];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30 py-10 px-6 md:px-16" dir="rtl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent animate-moss-pulse" />
          </div>
          <div>
            <span className="font-frank text-base font-bold text-foreground">BioSpace</span>
            <p className="text-[10px] text-muted-foreground/50 font-heebo">אנדוקרינולוגיה אדריכלית</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {LINKS.map(l => (
            <button key={l} className="text-xs text-muted-foreground/50 hover:text-muted-foreground font-heebo transition-colors">
              {l}
            </button>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-[10px] text-muted-foreground/30 font-heebo">
          © 2026 BioSpace. כשביולוגיה פוגשת בינוי.
        </p>
      </div>
    </footer>
  );
}