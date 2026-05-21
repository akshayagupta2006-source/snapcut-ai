import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
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
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 text-foreground text-left">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using our services, you agree to be bound by these
              Terms and Conditions and all terms incorporated by reference. If
              you do not agree to all of these terms, do not use our services.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to change or modify these Terms at any time
              and in our sole discretion. If we make changes, we will provide
              notice of such changes, such as by sending an email notification,
              providing notice through the Services, or updating the "Last
              Updated" date at the top of these Terms.
            </p>
            <p className="mb-6">
              Your continued use of the Services will confirm your acceptance
              of the revised Terms.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. Privacy Policy</h2>
            <p className="mb-6">
              Please refer to our Privacy Policy for information about how we
              collect, use, and disclose information about our users.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
            <p className="mb-4">
              You agree that you will not violate any law, contract, intellectual
              property or other third-party right or commit a tort, and that you
              are solely responsible for your conduct while accessing or using
              the Services.
            </p>
            <p className="mb-6">
              You agree that you will abide by these Terms and will not:
            </p>
            <ul className="list-disc list-inside mb-6 ml-4">
              <li>Use our Services for any illegal or unauthorized purpose.</li>
              <li>Impersonate any person or entity.</li>
              <li>Upload or transmit any viruses or other malicious code.</li>
              <li>Interfere with or disrupt the integrity or performance of the Services.</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="mb-6">
              All intellectual property rights in the Services and its content
              (excluding user-submitted content) are owned by us or our
              licensors.
            </p>

            <h2 className="text-xl font-semibold mb-4">6. Disclaimers</h2>
            <p className="mb-6">
              Our Services are provided "as is" and "as available" without
              warranties of any kind, either express or implied.
            </p>

            <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall we be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or
              any loss of data, use, goodwill, or other intangible losses,
              resulting from (a) your access to or use of or inability to
              access or use the services; (b) any conduct or content of any
              third party on the services.
            </p>

            <h2 className="text-xl font-semibold mb-4">8. Governing Law</h2>
            <p className="mb-6">
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict
              of law provisions.
            </p>

            <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about these Terms and Conditions, please
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