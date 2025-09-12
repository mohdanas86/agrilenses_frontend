import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Leaf,
  ChevronRight,
  Eye,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import { ScanRecord } from "./types";
import { useRouter } from "next/navigation";

interface ScanRecordItemProps {
  record: ScanRecord;
  isClient: boolean;
  getTimeDifference: (date: Date) => string;
}

export function ScanRecordItem({
  record,
  isClient,
  getTimeDifference,
}: ScanRecordItemProps) {
  const router = useRouter();

  // Format confidence as percentage (same logic as results page)
  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  const formatDiseaseName = (disease: string | null) => {
    if (!disease) return "Healthy";
    return disease.replace(/___/g, " - ").replace(/_/g, " ");
  };

  const handleViewDetails = () => {
    // Store the scan data for results page
    const scanResultData = {
      crop: record.crop,
      image: record.image,
      disease: record.disease || "Healthy",
      confidence: record.confidence,
      isHealthy: record.isHealthy,
      suggestion: record.suggestion || null,
      timestamp: record.timestamp.toISOString(),
    };

    localStorage.setItem("scanResult", JSON.stringify(scanResultData));
    router.push("/dashboard/results");
  };

  return (
    <Card
      className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
      onClick={handleViewDetails}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Image Section - Always visible */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            {record.image ? (
              <img
                src={record.image}
                alt={`${record.crop} scan`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`${
                record.image ? "hidden" : "flex"
              } w-full h-full items-center justify-center bg-gray-100`}
            >
              <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 truncate">
                  {record.crop}
                </h3>
                <div className="flex items-center">
                  {record.isHealthy ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-xs sm:text-sm">
                      <Shield className="h-3 w-3 mr-1" />
                      <span className="hidden xs:inline">Healthy Plant</span>
                      <span className="xs:hidden">Healthy</span>
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">
                        {formatDiseaseName(record.disease)}
                      </span>
                      <span className="sm:hidden truncate max-w-[120px]">
                        {formatDiseaseName(record.disease)?.substring(0, 12)}...
                      </span>
                    </Badge>
                  )}
                </div>
              </div>

              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0 self-start sm:self-center" />
            </div>

            {/* Metrics - Mobile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="p-1 bg-blue-50 rounded">
                  <Target className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Confidence</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatConfidence(record.confidence)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="p-1 bg-gray-50 rounded">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scanned</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getTimeDifference(record.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 col-span-2 sm:col-span-1">
                <div className="p-1 bg-purple-50 rounded">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {record.isHealthy ? "Good" : "Action Needed"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-xs text-gray-500">
              <span className="truncate">
                {isClient
                  ? record.timestamp.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
                {isClient && " • "}
                {isClient
                  ? record.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>

              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs hover:bg-gray-100 self-start sm:self-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <span className="hidden sm:inline">View Details</span>
                <span className="sm:hidden">View</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
