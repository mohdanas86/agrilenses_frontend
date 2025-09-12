"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Camera } from "lucide-react";
import { CropModel } from "./types";
import { ImageUploader } from "./ImageUploader";
import { ImagePreview } from "./ImagePreview";

interface ScannerCardProps {
  selectedCrop: CropModel;
  capturedImage: string | null;
  analyzing: boolean;
  error: string | null;
  onImageSelect: (image: string) => void;
  onRetakePhoto: () => void;
  onAnalyzeCrop: () => void;
}

export function ScannerCard({
  selectedCrop,
  capturedImage,
  analyzing,
  error,
  onImageSelect,
  onRetakePhoto,
  onAnalyzeCrop,
}: ScannerCardProps) {
  return (
    <Card className="shadow-sm border-green-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl text-gray-900 truncate">
              {capturedImage
                ? "Image Ready for Analysis"
                : `Upload ${selectedCrop.name} Image`}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 line-clamp-2">
              {capturedImage
                ? `Analyze with ${selectedCrop.name} model (${selectedCrop.accuracy} accuracy)`
                : `Take or upload a clear photo of your ${selectedCrop.name.toLowerCase()} plant leaf`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
            <span>{selectedCrop.emoji}</span>
            <span className="hidden sm:inline">{selectedCrop.name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="relative">
          {!capturedImage ? (
            <ImageUploader
              selectedCrop={selectedCrop}
              onImageSelect={onImageSelect}
            />
          ) : (
            <ImagePreview
              image={capturedImage}
              analyzing={analyzing}
              onRetake={onRetakePhoto}
              onAnalyze={onAnalyzeCrop}
            />
          )}
        </div>

        {error && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
