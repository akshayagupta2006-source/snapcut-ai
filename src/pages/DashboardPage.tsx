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
  Menu,
  X,
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Hidden on mobile, shown as drawer */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-6 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex
        `}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden mb-6">
            <span className="font-display font-bold text-lg text-foreground">Menu</span>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            {sidebarNav.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-secondary transition-colors min-h-[44px] touch-target"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gradient-primary rounded-xl text-primary-foreground text-center">
            <Zap className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Free Plan</p>
            <p className="text-xs mb-3">3 credits left</p>
            <Link
              to="/pricing"
              className="block w-full py-2 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors text-sm font-medium"
            >
              Upgrade to Pro
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header with mobile menu button */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden p-2 text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Dashboard
                </h1>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-primary text-primary-foreground rounded-xl font-semibold text-sm md:text-base hover:opacity-90 transition-opacity min-h-[44px] touch-target"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">New Upload</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>

            {/* Stats - Responsive grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              <div className="bg-card border border-border rounded-xl p-3 md:p-5">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Processed
                  </span>
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {totalProcessed}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  +{totalProcessed > 0 ? totalProcessed : "0"}%
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 md:p-5">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    This Month
                  </span>
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {thisMonth}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  credits used
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 md:p-5">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Images
                  </span>
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {thisMonth}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  processed
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 md:p-5">
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Avg Time
                  </span>
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{avgTime}</p>
                <p className="text-xs text-muted-foreground mt-1">per image</p>
              </div>
            </div>

            {/* Quick Actions - Responsive */}
            <h2 className="text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="bg-card border border-border rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4 hover:bg-secondary transition-colors cursor-pointer min-h-[44px] touch-target"
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <action.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base text-foreground truncate">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate hidden md:block">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Images */}
            <h2 className="text-lg md:text-xl font-display font-bold text-foreground mb-3 md:mb-4">
              Recent Images
            </h2>
            {visibleHistory.length === 0 ? (
              <Card className="border-border bg-card text-center py-8 md:py-12 px-4">
                <Image className="w-10 h-10 md:w-12 md:h-12 mx-auto text-muted-foreground mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
                  No uploaded images yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4 md:mb-6">
                  Start by uploading your first image
                </p>
                <Link to="/upload">
                  <Button className="bg-gradient-primary min-h-[44px] touch-target">
                    Upload Image
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {visibleHistory.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                          {/* Header with filename and status */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                                {item.fileName}
                              </h3>
                              <div className="flex flex-col gap-1 text-xs md:text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>{formatDate(item.timestamp)}</span>
                                </div>
                                <span>{formatTimeAgo(item.timestamp)}</span>
                              </div>
                            </div>
                            <span className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium whitespace-nowrap">
                              completed
                            </span>
                          </div>

                          {/* Before/After Images - Stacked on mobile */}
                          <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-medium text-muted-foreground">Original</p>
                              <img
                                src={item.originalImage}
                                alt="Original"
                                className="w-full h-24 md:h-32 rounded-lg object-cover border border-border"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-xs font-medium text-muted-foreground">Result</p>
                              <img
                                src={item.processedImage}
                                alt="Processed"
                                className="w-full h-24 md:h-32 rounded-lg object-cover border border-border"
                              />
                            </div>
                          </div>

                          {/* Actions - Scrollable on mobile */}
                          <div className="flex gap-2 flex-wrap overflow-x-auto pb-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary whitespace-nowrap min-h-[40px] touch-target"
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
                                  alert("Failed to download image.");
                                }
                              }}
                            >
                              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              <span className="hidden sm:inline">Original</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary whitespace-nowrap min-h-[40px] touch-target"
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
                                  alert("Failed to download image.");
                                }
                              }}
                            >
                              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              <span className="hidden sm:inline">Result</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="whitespace-nowrap min-h-[40px] touch-target"
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
                                  alert("Link copied!");
                                }
                              }}
                            >
                              <Share2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              Share
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive border-destructive hover:bg-destructive/10 whitespace-nowrap min-h-[40px] touch-target"
                                >
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {item.fileName}? This cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogAction
                                  className="bg-destructive"
                                  onClick={() => {
                                    setDeletedIds([...deletedIds, item.id || ""]);
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                              </AlertDialogContent>
                            </AlertDialog>
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
