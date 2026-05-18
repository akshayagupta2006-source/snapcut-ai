import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Crown,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: "$0",
    period: "forever",
    desc: "Perfect for trying out",
    popular: false,
    features: [
      "3 images/day",
      "Standard quality",
      "JPG & PNG export",
      "Community support",
    ],
    action: "free",
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
    action: "pro",
  },
];

export default function BillingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const currentPlan = {
    name: user?.plan === "pro" ? "Pro Plan" : "Free Plan",
    price: user?.plan === "pro" ? "$9" : "$0",
    billingCycle: user?.plan === "pro" ? "Monthly" : "Always Free",
    nextBillingDate: user?.plan === "pro" ? "Next billing: 30 days" : "N/A",
    status: "active",
    startDate: user?.planUpgradeDate 
      ? new Date(user.planUpgradeDate).toLocaleDateString() 
      : "N/A",
    imagesProcessed: 0,
    creditsUsed: user?.plan === "pro" ? "Unlimited" : "0",
  };

  const handleUpgradeToPro = async () => {
    if (!(window as any).Razorpay) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!(window as any).Razorpay) {
        alert("Payment system is loading. Please try again.");
        return;
      }
    }

    try {
let apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (!apiBaseUrl) {
  // Default to backend server running on port 5000 (backend server)
  const origin = window.location.origin.replace(/:\d+$/, '');
  apiBaseUrl = `${origin}:5000`;
}
apiBaseUrl = apiBaseUrl.replace(/\/$/, '');

console.log("Creating order with URL:", `${apiBaseUrl}/api/create-order`);
const orderResponse = await fetch(`${apiBaseUrl}/api/create-order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 500,
    currency: "INR",
    receipt: `receipt-${Date.now()}`,
  }),
});

      if (!orderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId } = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount: 50000,
        currency: "INR",
        name: "SnapCut AI",
        description: "Upgrade to Pro Plan",
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(
              `${apiBaseUrl}/api/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              if (user) {
                user.plan = "pro";
                user.credits = 1000;
                user.planUpgradeDate = new Date().toISOString();
                localStorage.setItem("user", JSON.stringify(user));
                setUser({ ...user });
              }
              alert("✅ Payment Successful! You've been upgraded to Pro.");
              window.location.reload();
            } else {
              alert("❌ Payment verification failed. Contact support.");
            }
          } catch (error) {
            alert("⚠️ Verification error. Contact support with payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function(response: any) {
        alert("❌ Payment failed: " + (response.error.description || "Please try again"));
      });
      rzp1.open();
    } catch (error) {
      alert("Failed to process payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-6 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex
        `}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <span className="font-display font-bold text-lg">Menu</span>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-secondary transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header with mobile menu button */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Billing & Payments
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and upgrade your plan
                </p>
              </div>
            </div>

            {/* Current Plan */}
            <Card className="mb-8 border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Plan</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {currentPlan.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Billing</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {currentPlan.billingCycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Next Billing</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {currentPlan.nextBillingDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">Cost</p>
                    <p className="text-base md:text-lg font-semibold text-foreground">
                      {currentPlan.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  {user?.plan !== "pro" && (
                    <Button 
                      onClick={handleUpgradeToPro}
                      className="bg-gradient-primary min-h-[44px]"
                    >
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Plans */}
            {user?.plan !== "pro" && (
              <div className="mb-8">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">
                  Upgrade Your Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.name}
                      className={`relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-primary-foreground text-xs font-bold rounded-full">
                          Recommended
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-gradient-primary' : 'bg-secondary'}`}>
                            <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`} />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
                            <p className="text-xs text-muted-foreground">{plan.desc}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-3xl font-display font-bold">{plan.price}</span>
                          <span className="text-muted-foreground text-sm">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {plan.action === "pro" ? (
                          <Button 
                            onClick={handleUpgradeToPro}
                            className="w-full bg-gradient-primary min-h-[44px]"
                          >
                            Upgrade to Pro
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full min-h-[44px]" disabled>
                            Current Plan
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Billing History */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Billing History
                </CardTitle>
                <CardDescription>
                  View your past transactions and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No billing history yet</p>
                  <p className="text-xs mt-1">Your transactions will appear here</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mt-8 border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border bg-secondary/50">
                  <p className="text-sm font-medium text-foreground">
                    No payment method added
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A payment method will be added when you upgrade to Pro
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}