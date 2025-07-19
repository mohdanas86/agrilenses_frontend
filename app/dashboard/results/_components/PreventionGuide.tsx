import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiseaseInfo } from "./types";

interface PreventionGuideProps {
  diseaseInfo: DiseaseInfo;
}

export function PreventionGuide({ diseaseInfo }: PreventionGuideProps) {
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
        </div>
      </CardContent>
    </Card>
  );
}
