import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from "lucide-react";
import { ScanResult, DiseaseInfo } from "./types";
import { getSeverityColor } from "./disease-database";

interface ScanResultSummaryProps {
  scanResult: ScanResult;
  diseaseInfo?: DiseaseInfo | null;
  isClient: boolean;
}

export function ScanResultSummary({
  scanResult,
  diseaseInfo,
  isClient,
}: ScanResultSummaryProps) {
  const confidencePercentage = Math.round((scanResult.confidence || 0) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {scanResult.isHealthy ? (
              <>
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2" />
                <span className="text-base sm:text-lg">Healthy Plant</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 mr-2" />
                <span className="text-base sm:text-lg">Disease Detected</span>
              </>
            )}
          </CardTitle>
          <Badge
            variant={scanResult.isHealthy ? "default" : "destructive"}
            className="text-xs sm:text-sm bg-green-100 text-green-800 border-green-200"
          >
            {confidencePercentage}% Confidence
          </Badge>
        </div>
        <CardDescription className="text-sm">
          {isClient && scanResult?.timestamp
            ? `Analysis completed on ${new Date(
                scanResult.timestamp
              ).toLocaleString()}`
            : "Analysis completed"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Crop Type</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {scanResult.crop || "Unknown"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Status</p>
            <p
              className={`text-base sm:text-lg font-semibold ${
                scanResult.isHealthy ? "text-green-600" : "text-red-600"
              }`}
            >
              {scanResult.isHealthy
                ? "Healthy"
                : scanResult.disease || "Unknown Disease"}
            </p>
          </div>
        </div>

        {!scanResult.isHealthy && scanResult.suggestion?.identification && (
          <div className="border-t pt-4">
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">
                Disease Information
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {scanResult.suggestion.identification.diseaseName ||
                  scanResult.disease}
              </p>
              {scanResult.suggestion.identification.confidence && (
                <p className="text-xs text-gray-500">
                  AI Confidence:{" "}
                  {scanResult.suggestion.identification.confidence}%
                </p>
              )}
            </div>

            {scanResult.suggestion.identification.symptoms &&
              scanResult.suggestion.identification.symptoms.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Symptoms Identified:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scanResult.suggestion.identification.symptoms.map(
                      (symptom, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {symptom}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}

        {!scanResult.isHealthy && diseaseInfo && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Severity Level
              </span>
              <Badge
                className={`${getSeverityColor(
                  diseaseInfo.severity
                )} border text-xs`}
              >
                {diseaseInfo.severity}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{diseaseInfo.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
