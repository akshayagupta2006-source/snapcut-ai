import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function RefundCancellation() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Refund and Cancellation Policy
            </h1>
            <p className="text-muted-foreground">
              Our policy regarding refunds and cancellations for our services.
            </p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 text-foreground text-left">
            <h2 className="text-xl font-semibold mb-4">1. Refund Policy</h2>
            <p className="mb-4">
              We offer refunds under certain conditions. If you are not
              satisfied with our service, you may be eligible for a refund
              within [Number] days of your purchase.
            </p>
            <p className="mb-6">
              To request a refund, please contact our support team with your
              order details and the reason for your request. All refund
              requests are subject to review and approval.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Non-Refundable Services</h2>
            <p className="mb-6">
              Certain services may be non-refundable. This will be clearly
              stated at the time of purchase.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. Cancellation Policy</h2>
            <p className="mb-4">
              You may cancel your subscription or service at any time.
              Cancellations will take effect at the end of your current billing
              period.
            </p>
            <p className="mb-6">
              No refunds will be provided for partial use of service periods
              after cancellation.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. Changes to Policy</h2>
            <p className="mb-6">
              We reserve the right to modify this Refund and Cancellation
              Policy at any time. Changes will be effective immediately upon
              posting to our website.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about our Refund and Cancellation
              Policy, please contact us at [Your Contact Email] or [Your Phone Number].
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              Last updated: April 2, 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}