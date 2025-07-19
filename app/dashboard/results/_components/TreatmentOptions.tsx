import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiseaseInfo } from "./types";

interface TreatmentOptionsProps {
  diseaseInfo: DiseaseInfo;
}

export function TreatmentOptions({ diseaseInfo }: TreatmentOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Treatment Options
        </CardTitle>
        <CardDescription className="text-sm">
          Choose the treatment method that best fits your farming approach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2 text-sm sm:text-base">
              🌱 Organic Treatments
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {diseaseInfo.organicTreatments.map((treatment, index) => (
                <li key={index}>• {treatment}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-700 mb-2 text-sm sm:text-base">
              🧪 Chemical Treatments
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {diseaseInfo.chemicalTreatments.map((treatment, index) => (
                <li key={index}>• {treatment}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ Always follow label instructions and local regulations
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
