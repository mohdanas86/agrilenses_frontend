"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ScanLine } from "lucide-react";
import { CropModel } from "./types";
import { CropSelector } from "./CropSelector";
import { BackButton } from "@/components/BackButton";

interface ScannerHeaderProps {
  selectedCrop: CropModel;
  onCropSelect: (crop: CropModel) => void;
  onBack: () => void;
}

export function ScannerHeader({
  selectedCrop,
  onCropSelect,
  onBack,
}: ScannerHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 lg:mb-10">
      {/* Header with back button */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <BackButton title={"Crop Disease Scanner"} />
      </div>

      {/* Description section */}
      <div className="mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
            AI-powered instant diagnosis for your crops. Upload a clear image of
            your plant leaf to get started.
          </p>
        </div>
      </div>

      {/* Crop selector section */}
      <div className="w-full">
        <CropSelector selectedCrop={selectedCrop} onCropSelect={onCropSelect} />
      </div>
    </div>
  );
}
