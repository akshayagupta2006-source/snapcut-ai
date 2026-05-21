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

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteImage = (id: string) => {
    const updatedHistory = imageHistory.filter((img) => img.id !== id);
    setImageHistory(updatedHistory);
    localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setImageHistory([]);
    localStorage.removeItem("imageHistory");
  };

  const addImage = (image: ImageHistory) => {
    const newImage = {
      ...image,
      id: image.id || `${image.timestamp}-${Date.now()}`,
    };
    const updatedHistory = [newImage, ...imageHistory];
    setImageHistory(updatedHistory);
    localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
  };

  return { imageHistory, isLoading, deleteImage, clearHistory, addImage };
};
