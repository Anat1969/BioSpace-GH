export default function Footer() {
  return (
    <footer className="relative py-12 px-6 md:px-12" dir="rtl">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-moss-pulse" />
          <span className="font-frank text-lg font-bold text-foreground">BioSpace</span>
        </div>
        <p className="text-xs text-muted-foreground font-heebo">
          אנדוקרינולוגיה אדריכלית — כשביולוגיה פוגשת בינוי
        </p>
      </div>
    </footer>
  );
}