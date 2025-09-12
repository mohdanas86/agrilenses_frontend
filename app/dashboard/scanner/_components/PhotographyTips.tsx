"use client";

import { CheckCircle, Lightbulb } from "lucide-react";

export function PhotographyTips() {
  const tips = [
    "Use natural daylight for best results",
    "Focus on one leaf showing symptoms",
    "Keep the leaf centered and in focus",
    "Avoid shadows and reflections",
    "Include both healthy and affected areas",
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-amber-100 p-1.5 sm:p-2 rounded-full flex-shrink-0">
          <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
        </div>
        <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
          Photography Tips
        </h3>
      </div>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2 sm:gap-3">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-amber-800">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
