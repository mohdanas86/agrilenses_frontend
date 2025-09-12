"use client";

import { Leaf } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
        <div className="flex items-center gap-2 text-gray-600">
          <Leaf className="h-5 w-5 text-green-600" />
          <p>Loading AgriLenses Scanner...</p>
        </div>
      </div>
    </div>
  );
}
