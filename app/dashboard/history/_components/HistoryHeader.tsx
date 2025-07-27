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
    <header className="mb-8">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <History className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Scan History
                  </h1>
                  <p className="text-gray-600">
                    Review your plant disease detection history and analysis
                    results
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Real-time Analysis
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-sm text-gray-500">
                  AI-powered detection
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => router.push("/dashboard/scanner")}
              >
                <Activity className="w-4 h-4 mr-2" />
                New Scan
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={onExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
