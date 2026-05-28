import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileImage,
  Loader2,
  Download,
  RefreshCw,
  ArrowLeftRight,
  Image,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Camera,
  Play,
  CameraOff,
} from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HistoryTab from "@/components/HistoryTab";

interface ImageHistory {
  originalImage: string;
  processedImage: string;
  fileName: string;
  timestamp: number;
}

type Stage = "upload" | "processing" | "result" | "error";
type View = "upload" | "history";
type UploadMethod = "file" | "url" | "camera";

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>("upload");
  const [view, setView] = useState<View>("upload");
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("file");
  const [dragOver, setDragOver] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [imageHistory, setImageHistory] = useState<ImageHistory[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  // New state to capture detailed backend error messages
  const [errorMessage, setErrorMessage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const location = useLocation();
  const [searchParams] = useSearchParams();


  const handleFile = useCallback(async (file: File) => {
    console.log(
      "handleFile called with file:",
      file.name,
      file.type,
      file.size,
    );
    if (!file.type.startsWith("image/")) {
      const invalidTypeMessage = "Please upload a valid image file (JPG, PNG, WEBP).";
      console.log("File is not an image:", file.type);
      setErrorMessage(invalidTypeMessage);
      setStage("error");
      return;
    }

    // Set filename and show original image
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setStage("processing");
    setProgress(10);

    try {
      console.log("Preparing image upload...");

      if (file.size > 15 * 1024 * 1024) {
        const sizeError =
          "Image is too large. Please upload an image smaller than 15MB.";
        console.error(sizeError, file.size);
        setErrorMessage(sizeError);
        setStage("error");
        setProgress(0);
        return;
      }

      setProgress(30);

      // Determine API endpoint.
      // In development, use Vite proxy by sending relative /api calls.
      // In production, use VITE_API_URL or VITE_API_BASE_URL if configured.
      const envApiBaseUrl =
        import.meta.env.VITE_API_BASE_URL?.trim() ||
        import.meta.env.VITE_API_URL?.trim();
      const apiBaseUrl = envApiBaseUrl ? envApiBaseUrl.replace(/\/$/, "") : "";
      const apiEndpoint = apiBaseUrl
        ? `${apiBaseUrl}/api/remove-background`
        : "/api/remove-background";

      console.log(
        "Resolved remove-background endpoint:",
        apiEndpoint,
        "(apiBaseUrl=", apiBaseUrl || "(proxy)", ")",
      );

      const formData = new FormData();
      formData.append("image", file, file.name);

      console.log("Sending image upload. file:", file.name, file.type, file.size);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      setProgress(70);
      console.log("Server response received. Status:", response.status);

      if (!response.ok) {
        const bodyText = await response.text();
        let parsedError: any = null;
        try {
          parsedError = JSON.parse(bodyText);
        } catch {
          parsedError = null;
        }

        const errorText =
          parsedError?.error || parsedError?.message || bodyText ||
          `HTTP ${response.status} Error`;
        console.error(
          "Server response not OK. Status:",
          response.status,
          "error:",
          errorText,
        );
        setErrorMessage(errorText);
        setStage("error");
        setProgress(0);
        return;
      }

      console.log("Parsing JSON response...");
      const processedJson = await response.json();
      console.log("JSON response:", processedJson);
      const processedUrl = processedJson.url;
      if (!processedUrl) {
        console.error(
          "Processed URL not found in JSON response:",
          processedJson,
        );
        setStage("error");
        throw new Error("Processed image URL not found in response.");
      }

      setProgress(90);
      setProcessedImage(processedUrl);
      setProgress(100);
      setStage("result");
      console.log("Image processed successfully. URL:", processedUrl);

      const newHistoryEntry: ImageHistory = {
        originalImage: url,
        processedImage: processedUrl,
        fileName: file.name,
        timestamp: Date.now(),
      };
      setImageHistory((prevHistory) => {
        const updatedHistory = [newHistoryEntry, ...prevHistory];
        localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
      console.log("History updated.");
      } catch (error) {
        console.error("Error removing background:", error);
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        setErrorMessage(errMsg);
        setStage("error");
        setProgress(0);
      }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleImageFromURL = async () => {
    if (!urlInput.trim()) return;
    setUrlLoading(true);
    try {
      const response = await fetch(urlInput);
      const blob = await response.blob();
      const nameFromUrl = urlInput.split("/").pop()?.split("?")[0] || "image";
      const file = new File([blob], nameFromUrl, { type: blob.type });
      handleFile(file);
      setUrlInput("");
    } catch (error) {
      console.error("Error loading image from URL:", error);
      alert("Failed to load image from URL. Make sure it's a valid image URL.");
    } finally {
      setUrlLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      console.log("=== Starting Camera ===");
      if (cameraActive) {
        console.log("Camera already active!");
        return;
      }

      console.log("Requesting camera access...");
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      console.log("✓ Stream obtained");

      if (!videoRef.current) {
        console.error("Video ref not available!");
        setCameraLoading(false);
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      // Set stream and state
      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      // Wait for stream to be ready
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCameraActive(true);
      setCameraLoading(false);
      console.log("✓ Camera active set to true");

      // Try to play
      try {
        await videoRef.current.play();
        console.log("✓ Video playing");
      } catch (playError) {
        console.warn("Play warning (but camera is active):", playError);
      }
    } catch (error: any) {
      console.error("Camera Error:", error.name, error.message);
      setCameraActive(false);
      setCameraLoading(false);

      if (error.name === "NotAllowedError") {
        alert("❌ Camera access denied. Allow camera in browser settings.");
      } else if (error.name === "NotFoundError") {
        alert("❌ No camera found");
      } else if (error.name === "NotReadableError") {
        alert("❌ Camera is in use by another app");
      } else {
        alert(`❌ Camera Error: ${error.message}`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
      streamRef.current = null;
    }
  };

  const captureFromCamera = () => {
    console.log("=== Capturing from Camera ===");

    if (!videoRef.current) {
      console.error("Video ref not available");
      alert("Camera not ready.");
      return;
    }

    if (!canvasRef.current) {
      console.error("Canvas ref not available");
      alert("Canvas not available.");
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas 2D context");
        alert("Failed to get canvas context.");
        return;
      }

      // Get video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      console.log("Video dimensions:", videoWidth, "x", videoHeight);

      if (videoWidth === 0 || videoHeight === 0) {
        console.error("Video not ready - dimensions are 0");
        alert("Video stream not ready. Please wait and try again.");
        return;
      }

      // Set canvas size and draw
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      console.log("✓ Frame drawn to canvas");

      // Convert to data URL synchronously
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      console.log("✓ Data URL created, length:", dataUrl.length);

      // Parse data URL to create blob
      const arr = dataUrl.split(",");
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      const blob = new Blob([u8arr], { type: "image/jpeg" });
      console.log("✓ Blob created, size:", blob.size);

      // Create file
      const filename = `camera-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: "image/jpeg" });
      console.log("✓ File created:", file.name);

      // Stop camera
      stopCamera();
      console.log("✓ Camera stopped");

      // Process file
      console.log("Calling handleFile...");
      handleFile(file);
      console.log("✓ handleFile called");
    } catch (error) {
      console.error("Capture error:", error);
      alert("Failed to capture. Error: " + String(error));
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            console.log("Image pasted from clipboard:", file);
            handleFile(file);
            break;
          }
        }
      }
    }
  };

  const reset = () => {
    setStage("upload");
    setOriginalImage(null);
    setProcessedImage(null);
    setShowOriginal(false);
    setProgress(0);
    setFileName("");
    setView("upload");
  };

  const onClearHistory = useCallback(() => {
    localStorage.removeItem("imageHistory");
    setImageHistory([]);
  }, []);

  const onDeleteItem = useCallback((timestamp: number) => {
    setImageHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter(
        (item) => item.timestamp !== timestamp,
      );
      localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const onSelectImage = useCallback((image: ImageHistory) => {
    setOriginalImage(image.originalImage);
    setProcessedImage(image.processedImage);
    setFileName(image.fileName);
    setStage("result");
    setView("upload");
  }, []);

  const handleDownload = useCallback(
    async (imageUrl: string, downloadFileName: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", downloadFileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
        alert("Failed to download image.");
      }
    },
    [],
  );

  useEffect(() => {
    console.log("UploadPage useEffect running");
    const storedHistory = localStorage.getItem("imageHistory");
    if (storedHistory) {
      setImageHistory(JSON.parse(storedHistory));
    }

    const action = searchParams.get("action");
    console.log("Action from URL:", action);
    // Payment functionality removed

    return () => {
      // Cleanup: Stop camera when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [location.search, searchParams]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col relative overflow-hidden"
      onPaste={handlePaste}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <main className="flex-1 pt-20 pb-16 px-4 md:pt-24 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs md:text-sm text-primary font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Background Removal
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-2 md:mb-3">
              Remove Background
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto">
              Upload an image and get a clean, transparent background instantly.
            </p>

            {/* Tab buttons with glassmorphism */}
            <div className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-8">
              <button
                onClick={() => setView("upload")}
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-target backdrop-blur-sm ${
                  view === "upload"
                    ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                📤 Upload
              </button>
              <button
                onClick={() => setView("history")}
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-target backdrop-blur-sm ${
                  view === "history"
                    ? "bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card/80 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                📋 History ({imageHistory.length})
              </button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {view === "upload" && (
              <>
                {/* Upload */}
                {stage === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    {/* Main Upload Area - Clean & Minimal */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer overflow-hidden ${
                        dragOver
                          ? "border-2 border-primary bg-primary/5 scale-[1.02]"
                          : "bg-card/80 backdrop-blur-xl border border-border/60 hover:border-primary/40 hover:shadow-xl"
                      }`}
                    >
                      {/* Animated gradient border */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        {/* Animated upload icon */}
                        <div className="relative mx-auto mb-6">
                          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30">
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Upload className="w-10 h-10 md:w-12 md:h-12 text-white" />
                            </motion.div>
                          </div>
                          {/* Glow effect */}
                          <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl animate-pulse" />
                        </div>

                        {/* Title */}
                        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
                          Drop your image here
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                          or click to browse • Supports JPG, PNG, WEBP
                        </p>

                        {/* Upload button */}
                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-semibold cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25 min-h-[48px]">
                          <FileImage className="w-5 h-5" />
                          Select Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleInputChange}
                          />
                        </label>

                        {/* Format badges */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                          {["JPG", "PNG", "WEBP"].map((fmt) => (
                            <span
                              key={fmt}
                              className="px-3 py-1 text-xs font-medium bg-secondary/80 text-muted-foreground rounded-full border border-border/50"
                            >
                              {fmt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Trust indicators - Minimal */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Free
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        No signup
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        Private
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Processing */}
                {stage === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="bg-card border border-border rounded-2xl p-12 text-center"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="4"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="42"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeDashoffset={`${2 * Math.PI * 42 * (1 - Math.min(progress, 100) / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-display font-bold text-foreground">
                          {Math.min(Math.round(progress), 100)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                      ⏳ Removing Background
                    </h3>
                    <p className="text-base text-muted-foreground mb-2">
                      Processing:&nbsp;
                      <span className="text-foreground font-semibold">
                        {fileName}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                      Please wait while we process your image...
                    </p>
                    {originalImage && (
                      <div className="rounded-xl overflow-hidden max-w-sm mx-auto opacity-40 mb-4">
                        <img
                          src={originalImage}
                          alt="Processing"
                          className="w-full"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Result */}
                {stage === "result" && processedImage && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-center gap-4 py-5 border-b border-border bg-secondary/50">
                        <button
                          onClick={() => setShowOriginal(false)}
                          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${!showOriginal ? "bg-gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-card border border-border"}`}
                        >
                          ✅ After
                        </button>
                        <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                        <button
                          onClick={() => setShowOriginal(true)}
                          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${showOriginal ? "bg-gradient-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-card border border-border"}`}
                        >
                          📷 Before
                        </button>
                      </div>

                      <div
                        className="relative p-8 flex items-center justify-center min-h-[400px]"
                        style={{
                          background: showOriginal
                            ? "hsl(var(--card))"
                            : "repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%) 50% / 20px 20px",
                        }}
                      >
                        <motion.img
                          key={showOriginal ? "before" : "after"}
                          src={showOriginal ? originalImage! : processedImage}
                          alt={showOriginal ? "Original" : "Background removed"}
                          className="max-h-[400px] rounded-lg object-contain shadow-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-6 border-t border-border bg-secondary/50 px-4">
                        <button
                          onClick={() =>
                            handleDownload(
                              processedImage!,
                              `processed_${fileName}`,
                            )
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                          <Download className="w-4 h-4" />
                          Download PNG
                        </button>
                        <button
                          onClick={reset}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 border border-border bg-card text-foreground rounded-xl font-semibold hover:bg-secondary active:scale-95 transition-all"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Upload Another
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
{stage === "error" && (
  <motion.div
    key="error"
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.97 }}
    className="bg-card border border-destructive/30 rounded-2xl p-12 text-center"
  >
    <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
    <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
      ❌ Processing Failed
    </h3>
    <p className="text-base text-muted-foreground mb-8">
      {errorMessage || "Something went wrong while processing your image."}
      <br />
      Please try again with a different image.
    </p>
    <button
      onClick={reset}
      className="px-8 py-3.5 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
    >
      🔄 Try Again
    </button>
  </motion.div>
)}
              </>
            )}

            {view === "history" && (
              <HistoryTab
                history={imageHistory}
                onClearHistory={onClearHistory}
                onSelectImage={onSelectImage}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
