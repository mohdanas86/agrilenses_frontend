"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, Loader2, ScanLine } from "lucide-react";

interface ImagePreviewProps {
  image: string;
  analyzing: boolean;
  onRetake: () => void;
  onAnalyze: () => void;
}

export function ImagePreview({
  image,
  analyzing,
  onRetake,
  onAnalyze,
}: ImagePreviewProps) {
  return (
    <div className="relative">
      <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
        <img
          src={image}
          alt="Uploaded crop image"
          className="w-full aspect-video object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Action Buttons - Stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
        <Button
          onClick={onRetake}
          variant="outline"
          size="lg"
          className="flex-1 border-gray-300 hover:border-gray-400 py-3"
          disabled={analyzing}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          <span className="sm:hidden">Choose Different</span>
          <span className="hidden sm:inline">Choose Different Image</span>
        </Button>
        <Button
          onClick={onAnalyze}
          disabled={analyzing}
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="sm:hidden">Analyzing...</span>
              <span className="hidden sm:inline">Analyzing Plant...</span>
            </>
          ) : (
            <>
              <ScanLine className="h-4 w-4 mr-2" />
              <span className="sm:hidden">Start Analysis</span>
              <span className="hidden sm:inline">Start AI Analysis</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
