import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Music,
  Play,
  Square,
  Download,
  Volume2,
} from "lucide-react";
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

export default function TextToAudioPage() {
  const [text, setText] = useState(
    "Hello! Welcome to our text to audio converter. Click the play button to hear this message.",
  );
  const [voice, setVoice] = useState("male");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async () => {
    if (!text.trim()) return;

    try {
      // Using Web Speech API for demonstration
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = voice === "male" ? 0.8 : 1.2;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);

      // Create a mock audio URL for download (in production, this would be from API)
      const mockAudioUrl = `data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==`;
      setAudioUrl(mockAudioUrl);
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
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
                Text to Audio
              </h1>
              <p className="text-muted-foreground">
                Convert text into natural-sounding speech
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Convert to Audio
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Enter Text
                      </label>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text to convert to audio..."
                        className="mt-2 h-32"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Voice Type
                      </label>
                      <Select value={voice} onValueChange={setVoice}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male Voice</SelectItem>
                          <SelectItem value="female">Female Voice</SelectItem>
                          <SelectItem value="neutral">Neutral Voice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      {!isPlaying ? (
                        <Button
                          onClick={generateAudio}
                          disabled={!text.trim()}
                          className="w-full bg-gradient-primary"
                        >
                          <Music className="w-4 h-4 mr-2" />
                          Generate & Play
                        </Button>
                      ) : (
                        <Button
                          onClick={stopAudio}
                          variant="outline"
                          className="w-full text-destructive"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}

                      {audioUrl && (
                        <Button
                          onClick={() => {
                            if (audioUrl) {
                              const link = document.createElement("a");
                              link.href = audioUrl;
                              link.download = `audio-${Date.now()}.mp3`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download MP3
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-2">
                <Card className="border-border bg-card p-8">
                  <div className="flex flex-col items-center justify-center min-h-96">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Volume2 className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Audio Preview
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      {isPlaying
                        ? "Playing audio..."
                        : "Generate audio to preview"}
                    </p>

                    {isPlaying && (
                      <motion.div
                        className="flex gap-1 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-primary rounded-full"
                            animate={{ height: ["8px", "20px", "8px"] }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.1,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </motion.div>
                    )}

                    <div className="text-sm text-muted-foreground max-w-xs">
                      Voice:{" "}
                      <span className="capitalize font-medium">{voice}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
