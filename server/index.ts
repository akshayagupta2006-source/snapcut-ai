import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import FormDataImport from "form-data";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const FormData = (FormDataImport as any).default || FormDataImport;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB upload limit
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    const isImage = file.mimetype?.startsWith?.("image/");
    cb(null, Boolean(isImage));
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Fallback API key if .env is not configured
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY?.trim() || "AbS7TBp4NTCeTj3H9FNBagcp";

console.log("Loaded backend .env from:", path.resolve(__dirname, ".env"));
console.log(
  "REMOVE_BG_API_KEY configured:",
  Boolean(REMOVE_BG_API_KEY),
);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:8080",
  "http://127.0.0.1:8080",
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.options("*", cors());

// Request logging for API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip} content-type=${req.headers["content-type"]}`,
    );
  }
  next();
});

// Increase body size limit to 15MB for image processing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.raw({ limit: '15mb', type: 'image/*' }));

// Razorpay integration removed — payments are disabled in this build.

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Backend server is running ✅" });
});

// Payment routes and Razorpay integration removed.

// Background removal endpoint using remove.bg API
app.post(
  "/api/remove-background",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      console.log("/api/remove-background handler started");
      console.log("REMOVE_BG_API_KEY configured:", Boolean(REMOVE_BG_API_KEY));
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Request body keys:", Object.keys(req.body || {}));
      console.log("File present:", Boolean((req as any).file));

      if (!REMOVE_BG_API_KEY) {
        console.error("REMOVE_BG_API_KEY is missing or empty");
        return res.status(503).json({
          error:
            "Background removal API key not configured. Please set REMOVE_BG_API_KEY in server/.env.",
        });
      }

      const file = (req as any).file as {
        buffer?: Buffer;
        mimetype?: string;
        originalname?: string;
      } | undefined;

      let imageBuffer: Buffer | null = null;
      let mimeType = "image/png";
      let filename = "upload.png";

      if (file && file.buffer && file.mimetype?.startsWith("image/")) {
        imageBuffer = file.buffer;
        mimeType = file.mimetype;
        filename = file.originalname || filename;
        console.log(
          "Received uploaded file:",
          filename,
          mimeType,
          "size=",
          imageBuffer.length,
        );
      } else if (typeof req.body?.image === "string") {
        const base64Data = (req.body as any).image.replace(
          /^data:image\/\w+;base64,/, 
          "",
        );
        imageBuffer = Buffer.from(base64Data, "base64");
        console.log("Received base64 image payload. size=", imageBuffer.length);
      }

      if (!imageBuffer) {
        console.error("No valid image found in request", {
          contentType: req.headers["content-type"],
          bodyKeys: Object.keys(req.body || {}),
          hasFile: Boolean(file),
        });
        return res.status(400).json({
          error:
            "No image uploaded. Please send a valid image file using the 'image' field.",
        });
      }

      if (imageBuffer.length === 0) {
        return res.status(400).json({ error: "Uploaded image is empty." });
      }

      if (imageBuffer.length > 15 * 1024 * 1024) {
        console.error("Uploaded image exceeds size limit.", imageBuffer.length);
        return res.status(413).json({
          error: "Image size exceeds 15MB limit. Please upload a smaller image.",
        });
      }

      const formData = new FormData();
      formData.append("image_file", imageBuffer, {
        filename,
        contentType: mimeType,
      });
      formData.append("size", "auto");

      const headers = {
        ...formData.getHeaders(),
        "X-Api-Key": REMOVE_BG_API_KEY,
      };
      console.log(
        "Calling remove.bg with endpoint: https://api.remove.bg/v1.0/removebg",
      );
      console.log(
        "remove.bg request headers sample:",
        typeof headers["content-type"] === "string"
          ? headers["content-type"].slice(0, 120)
          : headers["content-type"],
      );

      const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
        headers,
        responseType: "arraybuffer",
      });

      console.log("remove.bg response status:", response.status, response.statusText);
      const resultBase64 = Buffer.from(response.data).toString("base64");
      return res.json({
        success: true,
        url: `data:image/png;base64,${resultBase64}`,
      });
    } catch (error: any) {
      console.error("Background removal error raw:", error);

      const status = error.response?.status;
      const statusText = error.response?.statusText;
      let details = error.message;

      if (error.response?.data) {
        try {
          details = Buffer.from(error.response.data).toString("utf8");
        } catch (_) {
          details = JSON.stringify(error.response.data);
        }
      }

      console.error("Background removal error parsed:", {
        status,
        statusText,
        details,
      });

      if (status === 401) {
        return res.status(401).json({
          error: "Invalid API key. Please verify REMOVE_BG_API_KEY in server/.env.",
          details,
        });
      }

      if (status === 403) {
        return res.status(403).json({
          error:
            "Forbidden: remove.bg rejected your API key or account permissions.",
          details,
        });
      }

      if (status === 402) {
        return res.status(402).json({
          error: "API credits exhausted. Please upgrade your remove.bg plan.",
          details,
        });
      }

      if (status && status >= 400 && status < 500) {
        return res.status(status).json({
          error: "remove.bg request failed.",
          details,
        });
      }

      return res.status(500).json({
        error: "Failed to remove background.",
        details,
      });
    }
  },
);

app.use(
  (err: any, _req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled server error:", err);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "Uploaded image exceeds the 15MB limit. Please upload a smaller file.",
      });
    }

    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
      details: err.stack ? err.stack.toString() : undefined,
    });
  },
);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
