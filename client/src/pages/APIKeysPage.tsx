import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Key,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Function to generate random API key
const generateApiKey = () => {
  const prefix = "sk_live_";
  const randomPart = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return prefix + randomPart;
};

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});
  const [keyName, setKeyName] = useState("");
  const [newKeyCreated, setNewKeyCreated] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const storedKeys = localStorage.getItem("apiKeys");
    if (storedKeys) {
      try {
        setApiKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error("Error loading API keys:", error);
      }
    }
  }, []);

  const toggleKeyVisibility = (id: number) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    return (
      key.substring(0, 7) +
      "*".repeat(key.length - 14) +
      key.substring(key.length - 7)
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("API Key copied to clipboard!");
  };

  const handleGenerateKey = () => {
    if (!keyName.trim()) {
      alert("Please enter a key name");
      return;
    }

    const newApiKey = {
      id: Date.now(),
      name: keyName,
      key: generateApiKey(),
      created: new Date().toLocaleDateString(),
      environment: "Production",
      lastUsed: "Never",
      requests: 0,
      bandwidth: "0 MB",
      status: "active",
    };

    // Add to state
    const updatedKeys = [...apiKeys, newApiKey];
    setApiKeys(updatedKeys);

    // Save to localStorage
    localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));

    // Show the new key
    setNewKey(newApiKey.key);
    setNewKeyCreated(true);
    setKeyName("");

    // Reset after 10 seconds
    setTimeout(() => {
      setNewKeyCreated(false);
      setNewKey("");
      setIsOpen(false);
    }, 5000);
  };

  const handleDeleteKey = (id: number) => {
    const updatedKeys = apiKeys.filter((key) => key.id !== id);
    setApiKeys(updatedKeys);
    localStorage.setItem("apiKeys", JSON.stringify(updatedKeys));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 hidden md:flex flex-col">
          <div className="flex-1 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  API Keys
                </h1>
                <p className="text-muted-foreground">
                  Manage your API keys for integrating with Snapcut AI
                </p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New API Key</DialogTitle>
                    <DialogDescription>
                      Create a new API key for your application
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {newKeyCreated ? (
                      <>
                        <div className="p-4 rounded-lg bg-green-100 border border-green-300">
                          <p className="text-sm font-medium text-green-900 mb-3">
                            ✅ API Key Generated Successfully!
                          </p>
                          <div className="bg-white p-3 rounded font-mono text-sm break-all border border-green-200 mb-3">
                            {newKey}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => copyToClipboard(newKey)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Key
                          </Button>
                          <p className="text-xs text-green-800 mt-3">
                            ⚠️ Save this key somewhere safe. You won&apos;t be able to see it again.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input
                            id="keyName"
                            placeholder="e.g., Mobile App, Web Service"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        <Button
                          className="w-full bg-gradient-primary"
                          onClick={handleGenerateKey}
                        >
                          Generate
                        </Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Info Box */}
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    <strong>Keep your API keys secure.</strong> Never share them
                    publicly or commit them to version control. Regenerate keys
                    if you suspect they've been compromised.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <Card className="border border-dashed border-border bg-card/50">
                  <CardContent className="p-12 text-center">
                    <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No API Keys Yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first API key to get started with the SnapCut AI API
                    </p>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Generate First Key
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map((apiKey, index) => (
                  <motion.div
                    key={apiKey.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Key className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-lg mb-1">
                                {apiKey.name}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <div>
                                  <span className="text-xs font-medium">
                                    Created:
                                  </span>{" "}
                                  {apiKey.created}
                                </div>
                                <div>
                                  <span className="text-xs font-medium">
                                    Environment:
                                  </span>{" "}
                                  {apiKey.environment}
                                </div>
                                <div>
                                  <span className="text-xs font-medium">
                                    Last Used:
                                  </span>{" "}
                                  {apiKey.lastUsed}
                                </div>
                                <div>
                                  <span className="text-xs font-medium">
                                    Requests:
                                  </span>{" "}
                                  {apiKey.requests}
                                </div>
                                <div>
                                  <span className="text-xs font-medium">
                                    Bandwidth:
                                  </span>{" "}
                                  {apiKey.bandwidth}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              apiKey.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {apiKey.status}
                          </span>
                        </div>

                        {/* Key Display */}
                        <div className="bg-secondary/50 p-4 rounded-lg mb-4 font-mono text-sm flex items-center justify-between">
                          <span className="text-foreground/80">
                            {maskKey(apiKey.key, visibleKeys[apiKey.id] || false)}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {visibleKeys[apiKey.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 flex-wrap">
                          <Button variant="outline" size="sm">
                            Regenerate Key
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive border-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete API Key
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{apiKey.name}"?
                                  This action cannot be undone and will break any
                                  integrations using this key.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogAction 
                                className="bg-destructive"
                                onClick={() => handleDeleteKey(apiKey.id)}
                              >
                                Delete
                              </AlertDialogAction>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Documentation Section */}
            <Card className="mt-8 border-border bg-card">
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Learn how to integrate Snapcut AI into your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <h4 className="font-semibold text-foreground mb-2">
                      Getting Started
                    </h4>
                    <code className="text-sm bg-background p-3 rounded block overflow-x-auto">
                      {`curl https://api.snapcut.ai/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@image.jpg"`}
                    </code>
                  </div>
                  <Button variant="outline" className="w-full">
                    Read Full Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
