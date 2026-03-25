import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep shadow base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary" />
      
      {/* Diagonal golden light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-1/4 w-40 h-[140%] bg-gradient-to-b from-primary/20 via-primary/8 to-transparent rotate-[25deg] origin-top animate-beam-drift blur-md"
        />
        <div 
          className="absolute top-0 right-2/3 w-24 h-[120%] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rotate-[18deg] origin-top animate-beam-drift blur-lg"
          style={{ animationDelay: '3s' }}
        />
        <div 
          className="absolute top-0 left-1/4 w-16 h-[130%] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent rotate-[30deg] origin-top animate-beam-drift blur-sm"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* Organic texture overlay — rough concrete feel */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Moss accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l from-transparent via-accent to-transparent animate-moss-pulse" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 max-w-4xl text-right" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top marker */}
          <div className="flex items-center gap-3 mb-8 justify-start">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-xs tracking-[0.3em] text-primary/70 font-heebo uppercase">
              Architectural Endocrinology
            </span>
          </div>

          <h1 className="font-frank text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-foreground mb-6">
            הגוף קורא
            <br />
            <span className="text-primary">את הקירות</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-heebo text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10"
        >
          מתרגמים ביולוגיה לבינוי. גלה את הביופרופיל ההורמונלי של החלל שלך.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <button className="bg-primary text-primary-foreground font-heebo font-medium px-8 py-3.5 rounded-sm hover:bg-primary/90 transition-all duration-300 text-sm tracking-wide">
            סרוק את החלל שלך
          </button>
          <button className="border border-border text-foreground/70 font-heebo px-6 py-3.5 rounded-sm hover:border-primary/40 hover:text-foreground transition-all duration-300 text-sm">
            למד עוד
          </button>
        </motion.div>
      </div>

      {/* Vertical line accent */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
    </section>
  );
}