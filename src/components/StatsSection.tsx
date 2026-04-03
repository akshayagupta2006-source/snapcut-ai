import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
}

function AnimatedCounter({ end, suffix = "", label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-gradient">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-card border border-border rounded-2xl p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedCounter end={2500000} suffix="+" label="Images Processed" />
          <AnimatedCounter end={150} suffix="K+" label="Happy Users" />
          <AnimatedCounter end={3} suffix="s" label="Avg. Processing" />
          <AnimatedCounter end={99} suffix="%" label="Accuracy Rate" />
        </motion.div>
      </div>
    </section>
  );
}
