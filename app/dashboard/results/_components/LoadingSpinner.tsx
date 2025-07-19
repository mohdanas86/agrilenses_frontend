import { Leaf } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Leaf className="h-5 w-5 text-green-600" />
          <p className="text-sm sm:text-base">Loading scan results...</p>
        </div>
      </div>
    </div>
  );
}
