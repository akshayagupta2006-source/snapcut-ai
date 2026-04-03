import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, Download, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    // Using Unsplash API as a placeholder for image generation
    try {
      const searchQuery = prompt.replace(/\s+/g, "+");
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=e4pAKyB_5OP5k7D1W6_6STTzJlKn7lsL97J7rHu5HqE&count=1`,
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setGeneratedImage(data.results[0].urls.regular);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      // Fallback to placeholder
      setGeneratedImage(
        `https://via.placeholder.com/800x600?text=${encodeURIComponent(prompt)}`,
      );
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.jpg";
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
                Text to Image
              </h1>
              <p className="text-muted-foreground">
                Generate stunning images from text descriptions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Create Image
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Describe your image
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A sunset over mountains with birds flying..."
                        className="mt-2 h-32"
                      />
                    </div>

                    <Button
                      onClick={generateImage}
                      disabled={isLoading || !prompt.trim()}
                      className="w-full bg-gradient-primary"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isLoading ? "Generating..." : "Generate Image"}
                    </Button>

                    {generatedImage && (
                      <div className="space-y-2">
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-2">
                {generatedImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-border bg-card p-4 overflow-hidden">
                      <img
                        src={generatedImage}
                        alt="Generated"
                        className="w-full rounded-lg"
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        Prompt: {prompt}
                      </p>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-border bg-secondary/50 p-12 flex items-center justify-center min-h-96">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Wand2 className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Enter a description and click generate to create an
                        image
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Example Prompts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  "A futuristic city with neon lights",
                  "Serene beach at golden hour",
                  "Abstract colorful geometric shapes",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="p-3 rounded-lg border border-border hover:bg-secondary transition-colors text-left text-sm"
                  >
                    {example}
                  </button>
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
