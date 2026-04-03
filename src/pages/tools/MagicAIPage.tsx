import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wand2, Sparkles, Download, Copy, Zap } from "lucide-react";
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

const magicModes = [
  { id: "improve", name: "Improve Writing", desc: "Enhance clarity and tone" },
  { id: "expand", name: "Expand", desc: "Add more details" },
  { id: "summarize", name: "Summarize", desc: "Make it concise" },
  { id: "creative", name: "Creative", desc: "Make it more engaging" },
  { id: "format", name: "Format", desc: "Organize better" },
  { id: "translate", name: "Translate", desc: "Convert language" },
];

export default function MagicAIPage() {
  const [input, setInput] = useState(
    "This is a great product that everyone should buy because it works really good.",
  );
  const [mode, setMode] = useState("improve");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);

    try {
      // Simulating AI magic processing
      setTimeout(() => {
        const mockOutputs: Record<string, string> = {
          improve:
            "Discover an exceptional product that delivers outstanding performance and quality for everyone seeking reliable solutions in their daily lives.",
          expand:
            "This is a remarkable product that represents an excellent choice for anyone considering their options. It works exceptionally well, providing reliable performance and outstanding results. Everyone seeking quality solutions should seriously consider adding this to their collection.",
          summarize:
            "An excellent product that works reliably and benefits everyone.",
          creative:
            "✨ Introducing the game-changer you didn't know you needed! This powerhouse product delivers exceptional results that'll transform your experience. Join countless satisfied users today! 🚀",
          format: `• Exceptional Product Quality
• Reliable Performance
• Suitable for Everyone
• Outstanding Results
• Worth the Investment`,
          translate:
            "[Translated] Este es un producto fantástico que todos deberían comprar porque funciona realmente bien.",
        };

        setOutput(mockOutputs[mode] || "Content processed successfully!");
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Error processing text:", error);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (output) {
      const element = document.createElement("a");
      const file = new Blob([output], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `magic-ai-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
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
                Magic AI
              </h1>
              <p className="text-muted-foreground">
                Transform your text with AI-powered enhancements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 space-y-4 sticky top-24">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Magic Mode
                    </h2>

                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {magicModes.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div>
                              <p className="font-medium">{m.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {m.desc}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={processText}
                    disabled={isProcessing || !input.trim()}
                    className="w-full bg-gradient-primary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing..." : "Apply Magic"}
                  </Button>

                  {/* Mode Info */}
                  <Card className="border-border/50 bg-secondary/30 p-3">
                    <p className="text-xs text-muted-foreground">
                      {magicModes.find((m) => m.id === mode)?.desc}
                    </p>
                  </Card>
                </Card>
              </div>

              {/* Input & Output Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Input */}
                <Card className="border-border bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Original Text
                  </h2>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to transform..."
                    className="h-32"
                  />
                </Card>

                {/* Output */}
                <Card className="border-border bg-card p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground mb-2">
                      Transformed Text
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Applied: {magicModes.find((m) => m.id === mode)?.name}
                    </p>
                  </div>

                  <div className="bg-secondary/50 p-4 rounded-lg min-h-32 max-h-48 overflow-y-auto mb-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {output || "Transformed text will appear here..."}
                    </p>
                  </div>

                  {output && (
                    <div className="space-y-2">
                      <Button
                        onClick={handleCopy}
                        variant="outline"
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download as .txt
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Magic Mode Cards */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Try Magic Modes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {magicModes.map((m) => (
                  <motion.div
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      setInput(input || "Sample text to transform");
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="border-border bg-card/50 p-4 cursor-pointer hover:bg-card transition-colors">
                      <Zap className="w-5 h-5 text-primary mb-2" />
                      <p className="font-medium text-sm text-foreground mb-1">
                        {m.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Wand2,
                  title: "AI-Powered",
                  desc: "Advanced transformation",
                },
                {
                  icon: Sparkles,
                  title: "Multiple Modes",
                  desc: "6 different options",
                },
                {
                  icon: Copy,
                  title: "Easy Export",
                  desc: "Copy or download results",
                },
              ].map((tip, i) => (
                <Card key={i} className="border-border bg-card/50 p-4">
                  <tip.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {tip.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
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
