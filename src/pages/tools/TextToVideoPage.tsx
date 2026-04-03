import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Video, Play, Square, Download, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TextToVideoPage() {
  const [text, setText] = useState(
    "Create an amazing video about artificial intelligence and the future of technology",
  );
  const [duration, setDuration] = useState("15");
  const [style, setStyle] = useState("cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const generateVideo = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      // Simulating video generation with a placeholder
      // In production, this would use an API like Synthesia, D-ID, or similar
      setTimeout(() => {
        // Create a mock video preview (using a canvas-based animation)
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Draw gradient background
          const gradient = ctx.createLinearGradient(0, 0, 800, 600);
          gradient.addColorStop(0, "#1e1e2e");
          gradient.addColorStop(1, "#2d1b69");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 800, 600);

          // Draw text preview
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 32px Arial";
          ctx.textAlign = "center";
          const words = text.split(" ");
          const maxWords = 6;
          const displayText =
            words.slice(0, maxWords).join(" ") +
            (words.length > maxWords ? "..." : "");
          ctx.fillText(displayText, 400, 250);

          ctx.font = "16px Arial";
          ctx.fillStyle = "#a0a0a0";
          ctx.fillText(`Duration: ${duration}s | Style: ${style}`, 400, 350);

          const videoUrl = canvas.toDataURL();
          setVideoPreview(videoUrl);
        }

        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating video:", error);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoPreview) {
      const link = document.createElement("a");
      link.href = videoPreview;
      link.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
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
                Text to Video
              </h1>
              <p className="text-muted-foreground">
                Generate stunning videos from text descriptions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Create Video
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Video Description
                      </label>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Describe the video you want to create..."
                        className="mt-2 h-32"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Duration (seconds)
                      </label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Video Style
                      </label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                          <SelectItem value="documentary">
                            Documentary
                          </SelectItem>
                          <SelectItem value="animated">Animated</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={generateVideo}
                        disabled={isGenerating || !text.trim()}
                        className="w-full bg-gradient-primary"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {isGenerating ? "Generating..." : "Generate Video"}
                      </Button>

                      {videoPreview && (
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download MP4
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-2">
                {videoPreview ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-border bg-card p-8 flex flex-col items-center justify-center">
                      <img
                        src={videoPreview}
                        alt="Video Preview"
                        className="w-full rounded-lg mb-6"
                      />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Video ready for download
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-border bg-secondary/50 p-12 flex flex-col items-center justify-center min-h-96">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Video className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-center">
                      {isGenerating
                        ? "Generating your video..."
                        : "Describe your video and generate"}
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Example Prompts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Beautiful sunset over mountains with cinematic camera movement",
                  "Futuristic city with flying cars and neon lights",
                  "Ocean waves crashing on beach at golden hour",
                  "Forest canopy with sunlight filtering through trees",
                ].map((prompt, i) => (
                  <Card
                    key={i}
                    className="border-border bg-card/50 p-4 cursor-pointer hover:bg-card transition-colors"
                    onClick={() => setText(prompt)}
                  >
                    <p className="text-sm text-muted-foreground">{prompt}</p>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
