import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Upload,
  History,
  CreditCard,
  Key,
  Settings,
  Zap,
  Clock,
  Image,
  ArrowUpRight,
  Plus,
  Download,
  Share2,
  Trash2,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useImageHistory } from "@/hooks/useImageHistory";

const sidebarNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Upload, label: "Upload", path: "/upload" },
  { icon: History, label: "History", path: "/history" }, // Assuming a history page
  { icon: CreditCard, label: "Billing", path: "/billing" }, // Assuming a billing page
  { icon: Key, label: "API Keys", path: "/api-keys" }, // Assuming an API keys page
  { icon: Settings, label: "Settings", path: "/settings" }, // Assuming a settings page
];

const quickActions = [
  {
    icon: Upload,
    label: "Upload Image",
    desc: "Remove background from a new image",
    path: "/upload",
  },
  {
    icon: History,
    label: "View History",
    desc: "Access your recent processed images",
    path: "/history",
  },
  {
    icon: Key,
    label: "API Access",
    desc: "Generate API keys for integration",
    path: "/api-keys",
  },
];

export default function DashboardPage() {
  const { imageHistory } = useImageHistory();
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format timestamp to time ago
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  // Filter out deleted images
  const visibleHistory = imageHistory.filter(
    (img) => !deletedIds.includes(img.id || ""),
  );

  // Calculate stats
  const totalProcessed = imageHistory.length;
  const thisMonth = imageHistory.filter((img) => {
    const now = new Date();
    const imgDate = new Date(img.timestamp);
    return (
      imgDate.getMonth() === now.getMonth() &&
      imgDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Calculate average processing time (in a real app, this would come from server logs)
  const avgTime = totalProcessed > 0 ? "~2-3s" : "N/A";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
          <div className="flex-1 space-y-2">
            {sidebarNav.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gradient-primary rounded-xl text-primary-foreground text-center">
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Free Plan</p>
            <p className="text-xs">3 credits left</p>
            <Link
              to="/pricing"
              className="mt-3 block w-full py-2 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors text-sm font-medium"
            >
              Upgrade to Pro
            </Link>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground">
                Dashboard
              </h1>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                New Upload
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">
                    Images Processed
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {totalProcessed}
                </p>
                <p className="text-xs text-green-500">
                  +{totalProcessed > 0 ? totalProcessed : "0"}% from start
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">
                    Credits Used This Month
                  </span>
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {thisMonth}
                </p>
                <p className="text-xs text-muted-foreground">
                  Free plan • Unlimited
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">
                    This Month
                  </span>
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {thisMonth}
                </p>
                <p className="text-xs text-muted-foreground">
                  Images processed
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">
                    Avg. Time
                  </span>
                  <Clock className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-foreground">{avgTime}</p>
                <p className="text-xs text-muted-foreground">Per image</p>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {action.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Images */}
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              Recent Images
            </h2>
            {visibleHistory.length === 0 ? (
              <Card className="border-border bg-card text-center py-12">
                <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No uploaded images yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by uploading your first image
                </p>
                <Link to="/upload">
                  <Button className="bg-gradient-primary">Upload Image</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {visibleHistory.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6 items-start">
                          {/* Thumbnail */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.originalImage}
                              alt={item.fileName}
                              className="w-24 h-24 rounded-lg object-cover border border-border"
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg mb-1">
                                  {item.fileName}
                                </h3>
                                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Processed: {formatDate(item.timestamp)}
                                  </div>
                                  <div>
                                    Time: {formatTimeAgo(item.timestamp)}
                                  </div>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                completed
                              </span>
                            </div>

                            {/* Before/After Images */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="flex flex-col gap-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Original
                                </p>
                                <img
                                  src={item.originalImage}
                                  alt="Original"
                                  className="w-full h-32 rounded-lg object-cover border border-border"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <p className="text-xs font-medium text-muted-foreground">
                                  Background Removed
                                </p>
                                <img
                                  src={item.processedImage}
                                  alt="Processed"
                                  className="w-full h-32 rounded-lg object-cover border border-border"
                                />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 flex-wrap">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(item.originalImage);
                                    const blob = await response.blob();
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `original-${item.fileName}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                  } catch (error) {
                                    console.error("Error downloading image:", error);
                                    alert("Failed to download image. Please try again.");
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Original
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(item.processedImage);
                                    const blob = await response.blob();
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `processed-${item.fileName}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                  } catch (error) {
                                    console.error("Error downloading image:", error);
                                    alert("Failed to download image. Please try again.");
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Result
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const shareText = `Check out my image processed with SnapCut AI! ${window.location.origin}`;
                                  if (navigator.share) {
                                    navigator.share({
                                      title: "SnapCut AI Result",
                                      text: shareText,
                                      url: window.location.href,
                                    });
                                  } else {
                                    navigator.clipboard.writeText(shareText);
                                    alert("Link copied to clipboard!");
                                  }
                                }}
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
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
                                      Delete Image
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{" "}
                                      {item.fileName}? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogAction
                                    className="bg-destructive"
                                    onClick={() => {
                                      setDeletedIds([
                                        ...deletedIds,
                                        item.id || "",
                                      ]);
                                    }}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
