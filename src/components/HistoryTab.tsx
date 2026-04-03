import { motion } from "framer-motion";
import { Download, Image as ImageIcon, Trash2 } from "lucide-react";

interface ImageHistory {
  originalImage: string;
  processedImage: string;
  fileName: string;
  timestamp: number;
}

interface HistoryTabProps {
  history: ImageHistory[];
  onClearHistory: () => void;
  onSelectImage: (image: ImageHistory) => void;
}

export default function HistoryTab({
  history,
  onClearHistory,
  onSelectImage,
}: HistoryTabProps) {
  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `processed_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Processing History
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive rounded-xl font-medium hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">No processed images yet.</p>
          <p className="text-sm">Upload an image to see your history here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item, index) => (
            <div
              key={item.timestamp + "-" + index}
              className="bg-secondary border border-border rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-40 bg-muted flex items-center justify-center">
                <img
                  src={item.processedImage}
                  alt={item.fileName}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onSelectImage(item)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm font-medium text-foreground truncate mb-1">
                  {item.fileName}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
                <button
                  onClick={() =>
                    handleDownload(item.processedImage, item.fileName)
                  }
                  className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
