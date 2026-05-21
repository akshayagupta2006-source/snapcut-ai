import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ShippingDelivery() {
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
              Shipping & Delivery Policy
            </h1>
            <p className="text-muted-foreground">
              Information regarding the delivery of our digital products and services.
            </p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 text-foreground text-left">
            <h2 className="text-xl font-semibold mb-4">1. Digital Product Delivery</h2>
            <p className="mb-4">
              Our services primarily involve digital products (e.g., processed
              images, premium features). Upon successful payment, access to
              these digital products or features is typically granted
              immediately or within a short processing period.
            </p>
            <p className="mb-6">
              You will receive an email confirmation with details on how to
              access your purchased digital products or features.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Access and Usage</h2>
            <p className="mb-4">
              Access to premium features or processed images will be available
              through your account on our website. Ensure you have a stable
              internet connection to access and utilize these services.
            </p>
            <p className="mb-6">
              We are not responsible for any delays or failures in delivery
              due to issues with your internet service provider or device.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. No Physical Shipping</h2>
            <p className="mb-6">
              Please note that we do not offer physical shipping for any of our
              products or services. All deliveries are digital.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. Delivery Issues</h2>
            <p className="mb-4">
              If you experience any issues with accessing your purchased digital
              products or features, please contact our support team immediately.
              We will investigate the issue and provide assistance.
            </p>
            <p className="mb-6">
              Please provide your order number and a detailed description of the
              problem to help us resolve it quickly.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about our Shipping & Delivery Policy,
              please contact us at [Your Contact Email] or [Your Phone Number].
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