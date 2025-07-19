"use client";

import { useState, useEffect } from "react";
import {
  ScannerHeader,
  ScannerCard,
  ScannerSidebar,
  LoadingSpinner,
} from "./_components";
import { useScannerState } from "./_components/useScannerState";

// Available crop models with their details
const cropModels = [
  {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    description: "Detects common tomato diseases",
    accuracy: "96.2%",
    diseases: ["Late Blight", "Early Blight", "Bacterial Spot", "Leaf Mold"],
  },
  {
    id: "potato",
    name: "Potato",
    emoji: "🥔",
    description: "Identifies potato plant diseases",
    accuracy: "94.8%",
    diseases: ["Late Blight", "Early Blight", "Common Scab", "Black Dot"],
  },
  {
    id: "rice",
    name: "Rice",
    emoji: "🌾",
    description: "Rice disease detection model",
    accuracy: "92.1%",
    diseases: ["Blast", "Brown Spot", "Bacterial Blight"],
    disabled: true,
  },
  {
    id: "wheat",
    name: "Wheat",
    emoji: "🌾",
    description: "Wheat crop disease analysis",
    accuracy: "90.5%",
    diseases: ["Rust", "Powdery Mildew", "Septoria"],
    disabled: true,
  },
  {
    id: "corn",
    name: "Corn",
    emoji: "🌽",
    description: "Corn disease identification",
    accuracy: "91.7%",
    diseases: ["Northern Leaf Blight", "Gray Leaf Spot"],
    disabled: true,
  },
];

export default function CropScanner() {
  const [isClient, setIsClient] = useState(false);
  const {
    capturedImage,
    analyzing,
    error,
    selectedCrop,
    handleImageSelect,
    handleRetakePhoto,
    handleCropSelect,
    handleAnalyzeCrop,
    handleBack,
    handleViewHistory,
    handleViewResults,
  } = useScannerState();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <ScannerHeader
          selectedCrop={selectedCrop}
          onCropSelect={handleCropSelect}
          onBack={handleBack}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Scanner - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <ScannerCard
              selectedCrop={selectedCrop}
              capturedImage={capturedImage}
              analyzing={analyzing}
              error={error}
              onImageSelect={handleImageSelect}
              onRetakePhoto={handleRetakePhoto}
              onAnalyzeCrop={handleAnalyzeCrop}
            />
          </div>

          {/* Right Column - Tips and Info - Stack below on mobile */}
          <div className="lg:col-span-1">
            <ScannerSidebar
              selectedCrop={selectedCrop}
              onViewHistory={handleViewHistory}
              onViewResults={handleViewResults}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
