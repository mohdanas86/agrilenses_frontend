import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Thermometer, Clock } from "lucide-react";
import { ScanResult, EnvironmentalData } from "./types";

interface EnvironmentalContextProps {
  scanResult: ScanResult;
  isClient: boolean;
}

export function EnvironmentalContext({
  scanResult,
  isClient,
}: EnvironmentalContextProps) {
  // Mock environmental data - in real app, this would come from weather API
  const environmentalData: EnvironmentalData = {
    temperature: 28,
    humidity: 65,
    weather: "Partly Cloudy",
    scanTime:
      isClient && scanResult
        ? new Date(scanResult.timestamp).toLocaleTimeString()
        : "--:--",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
          Environmental Context
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Temperature</span>
            <span className="text-sm font-medium flex items-center">
              <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {environmentalData.temperature}°C
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Humidity</span>
            <span className="text-sm font-medium">
              {environmentalData.humidity}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weather</span>
            <span className="text-sm font-medium">
              {environmentalData.weather}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Scan Time</span>
            <span className="text-sm font-medium flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {environmentalData.scanTime}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
