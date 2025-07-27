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
      <CardContent className="p-0">
        <div className="flex items-center space-x-4 p-4">
          {/* Image Section */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
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
              <Leaf className="h-8 w-8 text-gray-400" />
            </div>

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {record.crop}
                </h3>
                <div className="flex items-center space-x-2">
                  {record.isHealthy ? (
                    <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                      <Shield className="h-3 w-3 mr-1" />
                      Healthy Plant
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {formatDiseaseName(record.disease)}
                    </Badge>
                  )}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-50 rounded">
                  <Target className="h-3 w-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Confidence</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatConfidence(record.confidence)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gray-50 rounded">
                  <Calendar className="h-3 w-3 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scanned</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {getTimeDifference(record.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="p-1 bg-purple-50 rounded">
                  <TrendingUp className="h-3 w-3 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {record.isHealthy ? "Good" : "Action Needed"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
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
                className="h-6 px-2 text-xs hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
