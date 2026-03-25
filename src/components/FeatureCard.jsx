import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <div className="relative overflow-hidden h-full rounded-sm border border-border/50 bg-card hover:border-primary/25 transition-all duration-500 p-8 md:p-10 flex flex-col gap-5">

        {/* Ambient hover glow */}
        <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm"
          style={{ background: "radial-gradient(180px circle at var(--mouse-x,50%) var(--mouse-y,0%), hsl(38 72% 55% / 0.04), transparent)" }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/40 transition-all duration-500" />

        {/* Icon */}
        <div className="w-11 h-11 rounded-sm bg-secondary/60 border border-border/40 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="font-frank text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-400 leading-snug">
            {title}
          </h3>
          <p className="font-heebo text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom moss line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}