import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, description, index }) {
  // Stagger and alternate visual weight
  const isHighlighted = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group relative"
    >
      <div 
        className={`
          relative overflow-hidden rounded-sm p-8 md:p-10 h-full
          border border-border/60 
          bg-gradient-to-br from-card via-card to-secondary/30
          hover:border-primary/30 
          transition-all duration-700 ease-out
        `}
      >
        {/* Ambient glow on hover */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-3xl transition-all duration-700" />

        {/* Moss accent — subtle organic touch */}
        <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent/${isHighlighted ? '40' : '20'} to-accent/0 group-hover:via-accent/60 transition-all duration-700`} />

        {/* Icon */}
        <div className="mb-6 text-3xl">{icon}</div>

        {/* Title */}
        <h3 className="font-frank text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-500">
          {title}
        </h3>

        {/* Description */}
        <p className="font-heebo text-sm md:text-base text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Corner detail — architectural nod */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-primary/0 group-hover:border-primary/30 transition-all duration-700" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-primary/0 group-hover:border-primary/30 transition-all duration-700" />
      </div>
    </motion.div>
  );
}