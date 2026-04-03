import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 text-foreground text-left">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when
              you create an account, upload images, or contact us. This may
              include your name, email address, and payment information.
            </p>
            <p className="mb-6">
              We also automatically collect certain information when you access
              and use our services, such as your IP address, device information,
              browser type, and usage data.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside mb-6 ml-4">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process your transactions and send related notifications.</li>
              <li>Communicate with you about products, services, and offers.</li>
              <li>Monitor and analyze trends, usage, and activities.</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">3. Sharing Your Information</h2>
            <p className="mb-4">
              We do not share your personal information with third parties
              except as described in this policy or with your consent.
            </p>
            <p className="mb-6">
              We may share information with vendors, consultants, and other
              service providers who need access to such information to carry
              out work on our behalf.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p className="mb-6">
              We implement reasonable measures to protect your personal
              information from unauthorized access, use, or disclosure.
              However, no internet transmission is completely secure.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Your Choices</h2>
            <p className="mb-4">
              You may update, correct, or delete information about you at any
              time by logging into your account or contacting us.
            </p>
            <p className="mb-6">
              You can opt out of receiving promotional emails from us by
              following the instructions in those emails.
            </p>

            <h2 className="text-xl font-semibold mb-4">6. Changes to This Policy</h2>
            <p className="mb-6">
              We may change this Privacy Policy from time to time. If we make
              changes, we will notify you by revising the date at the top of
              the policy and, in some cases, we may provide you with additional
              notice.
            </p>

            <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please
              contact us at [Your Contact Email] or [Your Phone Number].
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