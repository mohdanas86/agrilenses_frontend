"use client";

import { CropModel } from "./types";
import { PhotographyTips } from "./PhotographyTips";
import { DetectionInfo } from "./DetectionInfo";
import { QuickActions } from "./QuickActions";

interface ScannerSidebarProps {
  selectedCrop: CropModel;
  onViewHistory: () => void;
  onViewResults: () => void;
}

export function ScannerSidebar({
  selectedCrop,
  onViewHistory,
  onViewResults,
}: ScannerSidebarProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PhotographyTips />
      <DetectionInfo selectedCrop={selectedCrop} />
      <QuickActions
        onViewHistory={onViewHistory}
        onViewResults={onViewResults}
      />
    </div>
  );
}
