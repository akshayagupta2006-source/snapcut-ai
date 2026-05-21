import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wand2,
  Download,
  Plus,
  Minus,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function PhotoEnhancementPage() {
  const [image, setImage] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
  };

  const filterStyle = `
    brightness(${brightness}%) 
    contrast(${contrast}%) 
    saturate(${saturation}%) 
    blur(${blur}px)
  `;

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
                Photo Enhancement
              </h1>
              <p className="text-muted-foreground">
                Enhance your photos with advanced editing tools
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 space-y-6 sticky top-24">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full"
                    />
                  </div>

                  {image && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Brightness: {brightness}%
                        </label>
                        <Slider
                          value={[brightness]}
                          onValueChange={(value) => setBrightness(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Contrast: {contrast}%
                        </label>
                        <Slider
                          value={[contrast]}
                          onValueChange={(value) => setContrast(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Saturation: {saturation}%
                        </label>
                        <Slider
                          value={[saturation]}
                          onValueChange={(value) => setSaturation(value[0])}
                          min={0}
                          max={200}
                          step={1}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Blur: {blur}px
                        </label>
                        <Slider
                          value={[blur]}
                          onValueChange={(value) => setBlur(value[0])}
                          min={0}
                          max={20}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={resetFilters}
                          variant="outline"
                          className="w-full"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button
                          onClick={() => {
                            if (image) {
                              const link = document.createElement("a");
                              link.href = image;
                              link.download = `enhanced-photo-${Date.now()}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          className="w-full bg-gradient-primary"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              </div>

              {/* Preview */}
              <div className="lg:col-span-3">
                {image ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-border bg-card p-6">
                      <div className="flex overflow-x-auto gap-4 mb-4">
                        <img
                          src={image}
                          alt="Original"
                          className="w-1/2 rounded-lg"
                          style={{ filter: "none" }}
                        />
                        <img
                          src={image}
                          alt="Enhanced"
                          className="w-1/2 rounded-lg"
                          style={{ filter: filterStyle }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Original</span>
                        <span>Enhanced</span>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-border bg-secondary/50 p-12 flex flex-col items-center justify-center min-h-96">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Wand2 className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-center">
                      Upload an image to get started with photo enhancement
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
