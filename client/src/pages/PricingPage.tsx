import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, Crown, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free", icon: Zap, price: "$0", period: "forever",
    desc: "Perfect for trying out SnapCut AI", popular: false,
    features: ["3 images per day", "Standard quality", "JPG & PNG support", "Basic resolution", "Community support"],
    cta: "Get Started",
    action: "get_started",
  },
  {
    name: "Pro", icon: Crown, price: "$9", period: "/month",
    desc: "For professionals who need more power", popular: true,
    features: ["Unlimited removals", "HD quality output", "Batch processing (10)", "API access", "Priority support", "No watermark"],
    cta: "Upgrade to Pro",
    action: "upgrade_pro",
  },
  {
    name: "Pay-per-use", icon: CreditCard, price: "$0.05", period: "/image",
    desc: "Pay only for what you use", popular: false,
    features: ["No monthly commitment", "HD quality output", "Credits never expire", "Bulk discounts", "API access"],
    cta: "Buy Credits",
    action: "buy_credits",
  },
];

export default function PricingPage() {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`relative bg-card border rounded-2xl p-7 transition-shadow ${
                  plan.popular ? "border-primary card-glow" : "border-border hover:border-muted-foreground"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-primary-foreground text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-gradient-primary" : "bg-secondary"}`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                  </div>
                  <span className="font-display font-semibold text-lg text-foreground">{plan.name}</span>
                </div>
                <div className="mb-1">
                  <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCtaClick(plan.action)}
                  className={`block w-full py-2.5 rounded-xl font-medium text-sm text-center transition-all hover:opacity-90 ${
                    plan.popular ? "bg-gradient-primary text-primary-foreground" : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
