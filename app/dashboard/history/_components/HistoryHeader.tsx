import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, History, ArrowLeft, Share2, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryHeaderProps {
  onExport: () => void;
}

export function HistoryHeader({ onExport }: HistoryHeaderProps) {
  const router = useRouter();

  return (
    <header className="mb-6 sm:mb-8">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                  <History className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Scan History
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Review your plant disease detection history and analysis
                    results
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Real-time Analysis
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-xs sm:text-sm text-gray-500">
                  AI-powered detection
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => router.push("/dashboard/scanner")}
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                New Scan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9"
                onClick={onExport}
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Share Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
