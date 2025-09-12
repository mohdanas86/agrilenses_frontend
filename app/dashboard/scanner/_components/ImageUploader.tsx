"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";
import { CropModel } from "./types";

interface ImageUploaderProps {
  selectedCrop: CropModel;
  onImageSelect: (image: string) => void;
}

export function ImageUploader({
  selectedCrop,
  onImageSelect,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageSelect(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border-2 border-dashed border-green-200 flex items-center justify-center">
        <div className="text-center p-4 sm:p-6 lg:p-8">
          <div className="bg-green-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            Upload {selectedCrop.name} Image
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm mx-auto">
            Choose a clear image of your {selectedCrop.name.toLowerCase()} plant
            leaf. Our AI will analyze it for diseases and provide
            recommendations.
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="sm:hidden">Select Image</span>
            <span className="hidden sm:inline">Select Image from Device</span>
          </Button>
          <p className="text-xs text-gray-500 mt-3 sm:mt-4">
            Supports JPG, PNG • Max size 10MB
          </p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  );
}
