import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Trash2,
  Share2,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
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

const uploadHistory = [
  {
    id: 1,
    name: "product-photo.jpg",
    uploadDate: "Mar 15, 2026",
    processedDate: "2 hours ago",
    status: "completed",
    size: "2.4 MB",
    thumbnail: "https://via.placeholder.com/150?text=Product+Photo",
  },
];

export default function HistoryPage() {
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

  // Download handler for cross-origin images (e.g., Cloudinary)
  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
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
        <main className="flex-1 p-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Upload History
              </h1>
              <p className="text-muted-foreground">
                View and manage your previously uploaded images
              </p>
            </div>

            {visibleHistory.length === 0 ? (
              <Card className="border-border bg-card text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
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
                {visibleHistory.map((item, index) => (
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
                                onClick={() =>
                                  handleDownload(
                                    item.originalImage,
                                    `original-${item.fileName}`,
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Original
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary"
                                onClick={() =>
                                  handleDownload(
                                    item.processedImage,
                                    `processed-${item.fileName}`,
                                  )
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Result
                              </Button>
                              <Button variant="outline" size="sm">
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
                                    <AlertDialogTitle>Delete Image</AlertDialogTitle>
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
      <Footer />
    </div>
  );
}