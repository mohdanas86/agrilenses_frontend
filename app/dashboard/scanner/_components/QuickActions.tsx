"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onViewHistory: () => void;
  onViewResults: () => void;
}

export function QuickActions({
  onViewHistory,
  onViewResults,
}: QuickActionsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-2 sm:space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start text-left p-3 sm:p-4 h-auto"
          onClick={onViewHistory}
        >
          <div className="text-left">
            <div className="font-medium text-sm sm:text-base">
              View Scan History
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              See your previous diagnoses
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-left p-3 sm:p-4 h-auto"
          onClick={onViewResults}
        >
          <div className="text-left">
            <div className="font-medium text-sm sm:text-base">
              Latest Results
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Check recent analysis
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
