import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Copy, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function QRCodeGeneratorPage() {
  const [inputValue, setInputValue] = useState("https://snapcut.ai");
  const [qrCode, setQrCode] = useState<string | null>(null);

  const generateQR = () => {
    if (!inputValue.trim()) return;

    // Using QR Server API
    const encodedInput = encodeURIComponent(inputValue);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedInput}`;
    setQrCode(qrUrl);
  };

  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputValue);
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
                QR Code Generator
              </h1>
              <p className="text-muted-foreground">
                Create QR codes for URLs, text, and more
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <Card className="border-border bg-card p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Create QR Code
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Enter URL or Text
                      </label>
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="https://example.com"
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={generateQR}
                      disabled={!inputValue.trim()}
                      className="w-full bg-gradient-primary"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>

                    {qrCode && (
                      <div className="space-y-2">
                        <Button
                          onClick={handleCopy}
                          variant="outline"
                          className="w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PNG
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-2">
                {qrCode ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="border-border bg-card p-8 flex flex-col items-center">
                      <img
                        src={qrCode}
                        alt="QR Code"
                        className="w-80 h-80 mb-6"
                      />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          Encoded Data:
                        </p>
                        <p className="text-foreground font-mono text-sm break-all">
                          {inputValue.length > 100
                            ? `${inputValue.substring(0, 100)}...`
                            : inputValue}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-border bg-secondary/50 p-12 flex flex-col items-center justify-center min-h-96">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <QrCode className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-center">
                      Enter a URL or text and generate a QR code
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Use Cases
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Marketing", desc: "Share campaigns via QR codes" },
                  { title: "Business Cards", desc: "Add QR codes to cards" },
                  {
                    title: "Event Check-in",
                    desc: "Enable attendee registration",
                  },
                ].map((useCase) => (
                  <Card
                    key={useCase.title}
                    className="border-border bg-card p-4"
                  >
                    <h4 className="font-semibold text-foreground mb-1">
                      {useCase.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {useCase.desc}
                    </p>
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
