import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Upload,
  Download,
  Play,
  Settings,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GIFCreatorPage() {
  const [images, setImages] = useState<string[]>([]);
  const [duration, setDuration] = useState(500);
  const [quality, setQuality] = useState("high");
  const [isCreating, setIsCreating] = useState(false);
  const [gifPreview, setGifPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [...prev, event.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const createGIF = () => {
    if (images.length < 2) return;
    setIsCreating(true);

    try {
      // Simulating GIF creation with canvas
      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Create a preview showing animation frames
          ctx.fillStyle = "#1e1e2e";
          ctx.fillRect(0, 0, 400, 400);

          // Draw gradient
          const gradient = ctx.createLinearGradient(0, 0, 400, 400);
          gradient.addColorStop(0, "#1e1e2e");
          gradient.addColorStop(1, "#2d1b69");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 400, 400);

          // Draw text
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 24px Arial";
          ctx.textAlign = "center";
          ctx.fillText("GIF Animation", 200, 150);
          ctx.font = "16px Arial";
          ctx.fillStyle = "#a0a0a0";
          ctx.fillText(`Frames: ${images.length}`, 200, 200);
          ctx.fillText(
            `Frame Rate: ${Math.round(1000 / duration)}fps`,
            200,
            240,
          );

          const gifUrl = canvas.toDataURL();
          setGifPreview(gifUrl);
        }
        setIsCreating(false);
      }, 1500);
    } catch (error) {
      console.error("Error creating GIF:", error);
      setIsCreating(false);
    }
  };

  const handleDownload = () => {
    if (gifPreview) {
      const link = document.createElement("a");
      link.href = gifPreview;
      link.download = `animated-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                GIF Creator
              </h1>
              <p className="text-muted-foreground">
                Create animated GIFs from multiple images
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 space-y-6 sticky top-24">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Upload Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload 2+ images ({images.length} selected)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Frame Delay: {duration}ms
                    </label>
                    <Slider
                      value={[duration]}
                      onValueChange={(value) => setDuration(value[0])}
                      min={100}
                      max={1000}
                      step={50}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Quality
                    </label>
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Smaller file)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">
                          High (Best quality)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={createGIF}
                      disabled={isCreating || images.length < 2}
                      className="w-full bg-gradient-primary"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isCreating ? "Creating..." : "Create GIF"}
                    </Button>

                    {gifPreview && (
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download GIF
                      </Button>
                    )}
                  </div>
                </Card>
              </div>

              {/* Preview */}
              <div className="lg:col-span-3">
                {gifPreview ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-border bg-card p-8 flex flex-col items-center justify-center">
                      <img
                        src={gifPreview}
                        alt="GIF Preview"
                        className="w-full max-w-lg rounded-lg mb-6"
                      />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          GIF ready for download
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-border bg-card p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((image, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={image}
                            alt={`Frame ${i + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => removeImage(i)}
                              className="text-white text-sm font-medium hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            Frame {i + 1}
                          </div>
                        </div>
                      ))}

                      {images.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-muted-foreground text-center">
                            Upload images to create animated GIF
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Upload", desc: "Select 2 or more images" },
                { title: "Configure", desc: "Adjust frame delay and quality" },
                {
                  title: "Create & Download",
                  desc: "Generate and download your GIF",
                },
              ].map((step, i) => (
                <Card key={i} className="border-border bg-card/50 p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
