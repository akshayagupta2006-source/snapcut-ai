import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ContactUs() {
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
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              We're here to help! Reach out to us with any questions or concerns.
            </p>
          </motion.div>

          <div className="bg-card border border-border rounded-2xl p-8 text-foreground text-left">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              We value your feedback and are always happy to assist you. Please
              use the contact information below to get in touch with us.
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Phone Number:</h3>
              <p className="text-muted-foreground">[Your Phone Number]</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Email:</h3>
              <p className="text-muted-foreground">[Your Email Address]</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Address:</h3>
              <p className="text-muted-foreground">
                [Your Street Address]
                <br />
                [Your City, State, Zip Code]
                <br />
                [Your Country]
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Trade Name:</h3>
              <p className="text-muted-foreground">[Your Trade Name]</p>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              We aim to respond to all inquiries within 24-48 business hours.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}