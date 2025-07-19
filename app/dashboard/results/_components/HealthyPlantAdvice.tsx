import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function HealthyPlantAdvice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-700 text-base sm:text-lg">
          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
          Healthy Plant Detected
        </CardTitle>
        <CardDescription className="text-sm">
          Your crop appears to be in good health. Here are some tips to maintain
          its condition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              Preventive Measures
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Continue regular monitoring</li>
              <li>• Maintain proper watering schedule</li>
              <li>• Ensure adequate nutrition</li>
              <li>• Keep the growing area clean</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              Next Steps
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Schedule next inspection in 7-10 days</li>
              <li>• Watch for early signs of stress</li>
              <li>• Maintain optimal growing conditions</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
