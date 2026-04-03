import { useState, useEffect } from "react";

export interface ImageHistory {
  originalImage: string;
  processedImage: string;
  fileName: string;
  timestamp: number;
  id?: string;
}

export const useImageHistory = () => {
  const [imageHistory, setImageHistory] = useState<ImageHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem("imageHistory");
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          // Add IDs if not present
          const historyWithIds = parsedHistory.map(
            (item: ImageHistory, index: number) => ({
              ...item,
              id: item.id || `${item.timestamp}-${index}`,
            }),
          );
          setImageHistory(historyWithIds);
        }
      } catch (error) {
        console.error("Error loading image history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  return { imageHistory, isLoading };
};
