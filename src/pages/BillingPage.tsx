import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
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

const billingHistory: any[] = [];

const currentPlan = {
  name: "Free Plan",
  price: "$0",
  billingCycle: "Always Free",
  nextBillingDate: "N/A",
  status: "active",
  startDate: "N/A",
  imagesProcessed: 0,
  creditsUsed: 0,
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 hidden md:flex flex-col">
          <div className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Billing & Payments
              </h1>
              <p className="text-muted-foreground">
                Manage your subscription and view payment history
              </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Plan</p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Billing Cycle
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.billingCycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Next Billing Date
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.nextBillingDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Plan Started
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.startDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Images Processed
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.imagesProcessed}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Monthly Cost
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {currentPlan.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">
                      Active
                    </span>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Billing History
                </CardTitle>
                <CardDescription>
                  Download invoices and view past transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-foreground">
                            {item.description}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              item.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : item.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.status === "upcoming"
                              ? "Upcoming"
                              : item.status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{item.date}</span>
                          <span>{item.invoice}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-foreground">
                          {item.amount}
                        </p>
                        {item.status === "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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
                  <p className="text-sm font-medium text-foreground mb-2">
                    Visa ending in 4242
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires 12/2026
                  </p>
                </div>
                <Button variant="outline">Update Payment Method</Button>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
