import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
// Increase body size limit to 10MB for image processing
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ limit: '10mb', type: 'image/*' }));

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

    // Check if Razorpay is properly configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log("Razorpay Config Check:", {
      keyIdConfigured: !!keyId,
      keySecretConfigured: !!keySecret,
      keyIdPrefix: keyId ? keyId.substring(0, 8) + "..." : "none"
    });

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials not configured properly");
      return res.status(500).json({ 
        error: "Payment system not configured. Please check server environment variables." 
      });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt-${Date.now()}`,
    };

    console.log("Creating Razorpay order:", options);
    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order.id);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    let errorMessage = "Failed to create order";
    if (error.error) {
      errorMessage += ": " + (error.error.description || JSON.stringify(error.error));
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
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

// Background removal endpoint using remove.bg API
app.post("/api/remove-background", async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Background removal API key not configured. Please set REMOVE_BG_API_KEY environment variable." 
      });
    }

    // Get image from request body (base64) or raw buffer
    let imageBuffer: Buffer;
    
    if (req.body && req.body.image) {
      // Handle base64 encoded image
      const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    } else if (req.get("Content-Type")?.includes("image/")) {
      // Handle raw image data
      imageBuffer = req.body;
    } else {
      return res.status(400).json({ error: "No image data provided" });
    }

    // Call remove.bg API
    const formData = new FormData();
    formData.append("image_file", imageBuffer, { filename: "image.png" });

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    // Convert response to base64
    const resultBase64 = Buffer.from(response.data).toString("base64");
    const imageUrl = `data:image/png;base64,${resultBase64}`;

    res.json({ 
      success: true, 
      url: imageUrl 
    });
  } catch (error: any) {
    console.error("Background removal error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: "Invalid API key. Please check your REMOVE_BG_API_KEY." 
      });
    }
    
    if (error.response?.status === 402) {
      return res.status(402).json({ 
        error: "API credits exhausted. Please upgrade your remove.bg plan." 
      });
    }

    res.status(500).json({ 
      error: "Failed to remove background", 
      details: error.response?.data ? error.response.data.toString() : error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 Backend server running on http://localhost:${PORT}`
  );
});
