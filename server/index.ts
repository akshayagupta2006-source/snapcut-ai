import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay with secret key (only on backend)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Backend server is running ✅" });
});

// Create payment order
app.post("/api/create-order", async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt-${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Verify payment signature
app.post("/api/verify-payment", (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res
        .status(400)
        .json({ error: "Missing required payment details" });
    }

    // Verify signature using Razorpay's method
    const hmac = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET || ""
    );
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      // Payment is valid
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId,
      });
    } else {
      // Payment is invalid
      res.status(400).json({
        success: false,
        error: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Get payment details
app.post("/api/payment-details", async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Failed to fetch payment details" });
  }
});

// Webhook endpoint for Razorpay events
app.post("/api/webhook", (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ error: "Signature missing" });
    }

    const body = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      const event = req.body.event;
      const data = req.body.payload.payment.entity;

      if (event === "payment.authorized") {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Payment authorized:", data.id);
        }
        // Handle payment authorized event
      } else if (event === "payment.failed") {
        if (process.env.NODE_ENV === "development") {
          console.log("❌ Payment failed:", data.id);
        }
        // Handle payment failed event
      } else if (event === "payment.captured") {
        if (process.env.NODE_ENV === "development") {
          console.log("✅ Payment captured:", data.id);
        }
        // Handle payment captured event
      }

      res.json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Signature verification failed" });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 Backend server running on http://localhost:${PORT}`
  );
});
