import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanResult, DiseaseInfo } from "./types";

interface TreatmentOptionsProps {
  scanResult?: ScanResult;
  diseaseInfo?: DiseaseInfo;
}

export function TreatmentOptions({
  scanResult,
  diseaseInfo,
}: TreatmentOptionsProps) {
  // Use data from scanResult.suggestion if available, otherwise fall back to diseaseInfo
  const treatments = scanResult?.suggestion?.managementPlan?.treatments;
  const organicOptions = treatments?.organicOptions;
  const chemicalOptions = treatments?.chemicalOptions;
  const warning = treatments?.warning;

  // Fallback to diseaseInfo if no suggestion data
  const hasOrganicTreatments =
    organicOptions?.length || diseaseInfo?.organicTreatments?.length;
  const hasChemicalTreatments =
    chemicalOptions?.length || diseaseInfo?.chemicalTreatments?.length;

  if (!hasOrganicTreatments && !hasChemicalTreatments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Treatment Options
          </CardTitle>
          <CardDescription className="text-sm">
            No specific treatment information available
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
          {(organicOptions?.length ||
            diseaseInfo?.organicTreatments?.length) && (
            <div>
              <h4 className="font-semibold text-green-700 mb-3 text-sm sm:text-base">
                🌱 Organic Treatments
              </h4>
              <div className="space-y-3">
                {organicOptions?.map((treatment, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-3">
                    <h5 className="font-medium text-sm text-gray-800">
                      {treatment.activeIngredient}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {treatment.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Application:</strong> {treatment.application}
                    </p>
                  </div>
                )) ||
                  diseaseInfo?.organicTreatments?.map((treatment, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {treatment}
                    </li>
                  ))}
              </div>
            </div>
          )}

          {(chemicalOptions?.length ||
            diseaseInfo?.chemicalTreatments?.length) && (
            <div>
              <h4 className="font-semibold text-blue-700 mb-3 text-sm sm:text-base">
                🧪 Chemical Treatments
              </h4>
              <div className="space-y-3">
                {chemicalOptions?.map((treatment, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <h5 className="font-medium text-sm text-gray-800">
                      {treatment.activeIngredient}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {treatment.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Application:</strong> {treatment.application}
                    </p>
                  </div>
                )) ||
                  diseaseInfo?.chemicalTreatments?.map((treatment, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {treatment}
                    </li>
                  ))}
              </div>

              {warning && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">⚠️ {warning}</p>
                </div>
              )}

              {!warning && (
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ Always follow label instructions and local regulations
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
