import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanResult, DiseaseInfo } from "./types";

interface PreventionGuideProps {
  scanResult?: ScanResult;
  diseaseInfo?: DiseaseInfo;
}

export function PreventionGuide({
  scanResult,
  diseaseInfo,
}: PreventionGuideProps) {
  const longTermCareNotes = scanResult?.suggestion?.longTermCare?.notes;
  const hasPrevention =
    longTermCareNotes?.length || diseaseInfo?.prevention?.length;
  const hasCauses = diseaseInfo?.causes?.length;

  if (!hasPrevention && !hasCauses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Prevention for Future
          </CardTitle>
          <CardDescription className="text-sm">
            No specific prevention information available
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Prevention for Future
        </CardTitle>
        <CardDescription className="text-sm">
          Prevent recurrence with these management practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {longTermCareNotes && longTermCareNotes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Long-Term Care Notes
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {longTermCareNotes.map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          )}

          {diseaseInfo?.causes && diseaseInfo.causes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Disease Causes
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {diseaseInfo.causes.map((cause, index) => (
                  <li key={index}>• {cause}</li>
                ))}
              </ul>
            </div>
          )}

          {diseaseInfo?.prevention && diseaseInfo.prevention.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                Prevention Methods
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {diseaseInfo.prevention.map((method, index) => (
                  <li key={index}>• {method}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
