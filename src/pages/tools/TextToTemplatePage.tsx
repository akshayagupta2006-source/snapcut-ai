import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Copy, Download, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const templates = [
  {
    id: 1,
    name: "Professional Resume",
    description: "Create a polished resume for job applications",
    category: "professional",
    premium: false,
  },
  {
    id: 2,
    name: "Cover Letter",
    description: "Craft compelling cover letters for job opportunities",
    category: "professional",
    premium: false,
  },
  {
    id: 3,
    name: "Blog Post",
    description: "Write engaging blog content with structure",
    category: "content",
    premium: false,
  },
  {
    id: 4,
    name: "Social Media Caption",
    description: "Generate catchy social media content",
    category: "social",
    premium: false,
  },
  {
    id: 5,
    name: "Product Description",
    description: "Write product descriptions for e-commerce",
    category: "ecommerce",
    premium: true,
  },
  {
    id: 6,
    name: "Email Template",
    description: "Create professional email templates",
    category: "professional",
    premium: true,
  },
];

export default function TextToTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const template = templates.find((t) => t.id === selectedTemplate);

  const generateContent = async () => {
    if (!input.trim() || !template) return;
    setIsGenerating(true);

    try {
      // Simulating template content generation
      setTimeout(() => {
        const mockOutputs: Record<number, string> = {
          1: `RESUME\n\n${input.split(" ")[0] || "John Doe"}\nProfessional Software Engineer\n\nEXPERIENCE\n• Led team of 5 developers in building scalable applications\n• Improved system performance by 40%\n\nSKILLS\n• React, TypeScript, Node.js\n• Cloud Architecture, CI/CD\n\nEDUCATION\nBS Computer Science`,
          2: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${input} position at your esteemed organization.\n\nWith my extensive experience and passion for excellence, I am confident that I would be a valuable addition to your team.\n\nThank you for considering my application. I look forward to discussing how I can contribute to your organization's success.`,
          3: `# ${input}\n\n## Introduction\nStart with an engaging hook to capture reader attention.\n\n## Main Points\n1. First key insight\n2. Supporting evidence\n3. Practical recommendations\n\n## Conclusion\nSummarize key takeaways and call to action.`,
          4: `✨ ${input.substring(0, 50)}... ✨\n\n🚀 Check this out!\n💡 Perfect for today's mood\n#trending #awesome #explore`,
          5: `PRODUCT: ${input}\n\nFeatures:\n• High quality performance\n• Durable construction\n• Perfect for any occasion\n\nBenefits:\n• Save time and money\n• Eco-friendly option\n• Excellent customer support`,
          6: `Subject: ${input}\n\nDear [Recipient],\n\nI hope this message finds you well.\n\n[Your message here]\n\nBest regards,\n[Your Name]`,
        };

        setOutput(
          mockOutputs[template.id] || "Content generated successfully!",
        );
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating content:", error);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (output) {
      const element = document.createElement("a");
      const file = new Blob([output], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${template?.name?.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.txt`;
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
                Text to Template
              </h1>
              <p className="text-muted-foreground">
                Generate professional content from templates
              </p>
            </div>

            {!selectedTemplate ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tmpl) => (
                  <motion.div
                    key={tmpl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      className="border-border bg-card p-6 cursor-pointer hover:border-primary transition-colors relative"
                      onClick={() => {
                        if (!tmpl.premium) {
                          setSelectedTemplate(tmpl.id);
                        }
                      }}
                    >
                      {tmpl.premium && (
                        <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                      <FileText className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        {tmpl.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tmpl.description}
                      </p>
                      <Button
                        className="w-full bg-gradient-primary"
                        disabled={tmpl.premium}
                      >
                        {tmpl.premium ? "Coming Soon" : "Use Template"}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <Card className="border-border bg-card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      {template?.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template?.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Your Information
                        </label>
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={`Enter details for ${template?.name?.toLowerCase()}...`}
                          className="mt-2 h-40"
                        />
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={generateContent}
                          disabled={isGenerating || !input.trim()}
                          className="w-full bg-gradient-primary"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {isGenerating ? "Generating..." : "Generate"}
                        </Button>

                        <Button
                          onClick={() => setSelectedTemplate(null)}
                          variant="outline"
                          className="w-full"
                        >
                          Back to Templates
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Output */}
                <div>
                  <Card className="border-border bg-card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Generated Content
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-secondary/50 p-4 rounded-lg min-h-48 max-h-48 overflow-y-auto">
                        <p className="text-sm text-foreground whitespace-pre-wrap font-mono">
                          {output || "Generated content will appear here..."}
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
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
