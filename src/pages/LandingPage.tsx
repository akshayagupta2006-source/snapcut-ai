import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Zap,
  Shield,
  Image,
  Layers,
  Download,
  ArrowRight,
  Scissors,
  Star,
  Check,
  Crown,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import StatsSection from "@/components/StatsSection";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Remove backgrounds in under 3 seconds with our optimized AI pipeline.",
  },
  {
    icon: Scissors,
    title: "Pixel-Perfect Edges",
    desc: "AI detects hair, fur, and complex edges with stunning precision.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Images are automatically deleted after processing. Nothing stored.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    desc: "Process multiple images at once with our Pro plan. Save hours.",
  },
  {
    icon: Download,
    title: "HD Downloads",
    desc: "Get full-resolution PNG files with transparent backgrounds.",
  },
  {
    icon: Image,
    title: "Any Format",
    desc: "Upload JPG, PNG, or WEBP. We handle all major image formats.",
  },
];

const useCases = [
  {
    emoji: "🛒",
    title: "E-Commerce",
    desc: "Clean product photos for your online store",
  },
  {
    emoji: "📸",
    title: "Photography",
    desc: "Quick background removal for portraits",
  },
  {
    emoji: "🎨",
    title: "Design",
    desc: "Create assets for your design projects",
  },
  {
    emoji: "📱",
    title: "Social Media",
    desc: "Make eye-catching content that stands out",
  },
];

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    desc: "Try it out",
    popular: false,
    features: [
      "3 images/day",
      "Standard quality",
      "JPG & PNG",
      "Community support",
    ],
    cta: "Get Started",
    action: "get_started",
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$9",
    period: "/month",
    desc: "For professionals",
    popular: true,
    features: [
      "Unlimited removals",
      "HD quality",
      "Batch processing",
      "API access",
      "Priority support",
      "No watermark",
    ],
    cta: "Upgrade to Pro",
    action: "upgrade_pro",
  },
  {
    name: "Credits",
    icon: CreditCard,
    price: "$0.05",
    period: "/image",
    desc: "Pay as you go",
    popular: false,
    features: [
      "No subscription",
      "HD quality",
      "Credits never expire",
      "Bulk discounts",
      "API access",
    ],
    cta: "Buy Credits",
    action: "buy_credits",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleCtaClick = (action: string) => {
    if (action === "get_started") {
      navigate("/upload");
    } else if (action === "upgrade_pro") {
      navigate("/upload?action=upgrade_pro");
    } else if (action === "buy_credits") {
      navigate("/upload?action=buy_credits");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 md:pt-32 md:pb-20 md:px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 bg-primary/10 border border-primary/30 rounded-full text-xs md:text-sm text-foreground mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" />
              AI-Powered Background Removal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4 md:mb-6">
              Remove Image <span className="text-gradient">Backgrounds</span> in One Click
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-lg">
              Upload any photo and get a clean, background-free image in
              seconds. No design skills needed. Powered by cutting-edge AI.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-7 md:py-3.5 bg-gradient-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-base hover:opacity-90 transition-opacity shadow-lg min-h-[48px] touch-target"
                style={{ boxShadow: "var(--shadow-glow)" }}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                Upload Image — It's Free
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-7 md:py-3.5 border border-border rounded-xl text-foreground font-medium hover:bg-secondary transition-colors min-h-[48px] touch-target"
              >
                See Demo
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> No signup required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> Free 3 images/day
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full"
          >
            <div id="demo" className="w-full">
              <BeforeAfterSlider />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 md:mt-4">
              ↔ Drag the slider to compare
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* How it Works */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
              How It Works
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-12 md:mb-16 max-w-md mx-auto px-4">
              Three simple steps. No learning curve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drag & drop or click to upload your image",
                icon: Upload,
              },
              {
                step: "02",
                title: "AI Processes",
                desc: "Our AI removes the background in seconds",
                icon: Zap,
              },
              {
                step: "03",
                title: "Download",
                desc: "Get your clean PNG with transparent background",
                icon: Download,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative group"
              >
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/40 transition-colors">
                  <div className="text-5xl md:text-6xl font-display font-bold text-muted/30 absolute top-3 md:top-4 right-4 md:right-6">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 md:mb-5">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-base md:text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-muted-foreground">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12 md:mb-16" {...fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
              Why Choose SnapCut AI?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto px-4">
              Built for speed, quality, and simplicity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-5 md:p-6 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gradient-primary transition-colors">
                  <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-sm md:text-base text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-8 md:mb-12" {...fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
              Built For Everyone
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center cursor-default"
              >
                <div className="text-2xl md:text-3xl mb-2 md:mb-3">{uc.emoji}</div>
                <h4 className="font-display font-semibold text-foreground text-xs md:text-sm mb-1">
                  {uc.title}
                </h4>
                <p className="text-xs text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-card/30" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-8 md:mb-12" {...fadeUp}>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card border rounded-2xl p-5 md:p-7 ${plan.popular ? "border-primary card-glow" : "border-border"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-primary text-primary-foreground text-xs font-bold rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-gradient-primary" : "bg-secondary"}`}
                  >
                    <plan.icon
                      className={`w-4 h-4 md:w-5 md:h-5 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}
                    />
                  </div>
                  <span className="font-display font-semibold text-base md:text-lg text-foreground">
                    {plan.name}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-xs md:text-sm ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6">
                  {plan.desc}
                </p>
                <ul className="space-y-2 mb-6 md:mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs md:text-sm text-secondary-foreground"
                    >
                      <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCtaClick(plan.action)}
                  className={`block w-full py-2.5 md:py-3 rounded-xl font-medium text-sm text-center transition-opacity hover:opacity-90 min-h-[44px] touch-target ${
                    plan.popular
                      ? "bg-gradient-primary text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <motion.div className="max-w-3xl mx-auto text-center" {...fadeUp}>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-foreground mb-4 md:mb-6">
            Ready to Remove Backgrounds?
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-lg mx-auto px-4">
            Join 150,000+ users who trust SnapCut AI for instant, high-quality
            background removal.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-lg hover:opacity-90 transition-opacity min-h-[48px] touch-target"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            Upload Your First Image — Free
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
