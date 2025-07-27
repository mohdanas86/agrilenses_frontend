import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ScanResult, DiseaseInfo } from "./types";

interface ImmediateActionProps {
  scanResult?: ScanResult;
  diseaseInfo?: DiseaseInfo;
}

export function ImmediateAction({
  scanResult,
  diseaseInfo,
}: ImmediateActionProps) {
  const culturalActions =
    scanResult?.suggestion?.managementPlan?.culturalAndPreventative;
  const symptoms =
    scanResult?.suggestion?.identification?.symptoms || diseaseInfo?.symptoms;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-red-700 text-base sm:text-lg">
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          Immediate Action Required
        </CardTitle>
        <CardDescription className="text-sm">
          Follow these steps immediately to prevent disease spread
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {culturalActions && culturalActions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Cultural & Preventative Actions
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {culturalActions.map((action, index) => (
                  <li key={index}>• {action}</li>
                ))}
              </ul>
            </div>
          )}

          {!culturalActions?.length && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                First Steps
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Isolate affected plants immediately</li>
                <li>• Remove and destroy infected leaves</li>
                <li>• Avoid working with plants when wet</li>
                <li>• Clean tools with disinfectant</li>
              </ul>
            </div>
          )}

          {symptoms && symptoms.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Symptoms to Watch
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {symptoms.map((symptom, index) => (
                  <li key={index}>• {symptom}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
