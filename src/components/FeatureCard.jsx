import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <div className="relative overflow-hidden h-full border border-border bg-card hover:border-primary/20 transition-all duration-500 p-9 md:p-10 flex flex-col gap-6">

        {/* Index marker */}
        <div className="flex items-center gap-3">
          <span className="font-frank text-[11px] text-muted-foreground/50 tabular-nums leading-none select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-border/60" />
          {Icon && (
            <span className="text-accent group-hover:text-primary transition-colors duration-400">
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-400 leading-snug">
            {title}
          </h3>
          <p className="font-heebo text-sm text-muted-foreground leading-[1.8] font-light">
            {description}
          </p>
        </div>

        {/* Bottom accent — sage */}
        <div className="w-8 h-px bg-accent/50 group-hover:w-16 transition-all duration-500" />
      </div>
    </motion.div>
  );
}