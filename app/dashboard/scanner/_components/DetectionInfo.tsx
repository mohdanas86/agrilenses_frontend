"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropModel } from "./types";

interface DetectionInfoProps {
  selectedCrop: CropModel;
}

export function DetectionInfo({ selectedCrop }: DetectionInfoProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedCrop.emoji}</span>
          <CardTitle className="text-base sm:text-lg">
            {selectedCrop.name} Detection
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Model Accuracy</span>
            <span className="text-green-600 font-bold text-sm sm:text-base">
              {selectedCrop.accuracy}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Detectable Diseases</span>
            <span className="text-green-600 font-medium">
              {selectedCrop.diseases.length} types
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-600 text-xs mb-2">
              Common diseases detected:
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedCrop.diseases.map((disease) => (
                <span
                  key={disease}
                  className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200"
                >
                  {disease}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">{selectedCrop.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
