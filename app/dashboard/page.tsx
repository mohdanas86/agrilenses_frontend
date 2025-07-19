"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera,
  Search,
  Sun,
  Droplets,
  Leaf,
  ChevronRight,
  Thermometer,
  Lightbulb,
} from "lucide-react";

// Types
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

// Mock data based on the design
const mockWeather: WeatherData = {
  temperature: 28,
  condition: "Partly Cloudy",
  humidity: 65,
  location: "Chennai, TN",
};

const supportedCrops = [
  { name: "Tomato", image: "🍅", count: 8, isAval: true },
  { name: "Potato", image: "🥔", count: 6, isAval: true },
  { name: "Rice", image: "🌾", count: 4, isAval: false },
  { name: "Wheat", image: "🌾", count: 3, isAval: false },
  { name: "Corn", image: "🌽", count: 5, isAval: false },
  { name: "Bell Pepper", image: "🫑", count: 4, isAval: false },
  { name: "Apple", image: "🍎", count: 3, isAval: false },
  { name: "Grape", image: "🍇", count: 2, isAval: false },
];

export default function AgriLensDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time and start the interval timer
    const now = new Date();
    setCurrentTime(now);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const filteredCrops = supportedCrops.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    if (!date) return "";
    return date
      .toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " at");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Agri-Lens
          </h1>
          <p className="text-md text-gray-600">
            AI-powered crop disease detection for healthier harvests
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentTime ? formatTime(currentTime) : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === LEFT COLUMN === */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scan Your Crop Card */}
            <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Scan Your Crop</h2>
                  <p className="text-green-100 mt-1">
                    Take a photo of your crop leaf for instant disease detection
                    and treatment recommendations
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-white text-green-700 hover:bg-green-50 font-semibold text-base mt-4 py-6 flex justify-between items-center"
                onClick={() => router.push("/scanner")}
              >
                Start Diagnosis
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Select Your Crop Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <CardTitle>Select Your Crop</CardTitle>
                </div>
                <CardDescription>
                  Choose from our supported crops for accurate disease detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.name}
                      className={`group p-4 rounded-lg border transition-all duration-200 text-center ${
                        crop.isAval
                          ? "hover:border-green-500 hover:bg-green-50/50 border-gray-200"
                          : "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                      }`}
                      disabled={!crop.isAval}
                    >
                      <div className="text-4xl mb-2">{crop.image}</div>
                      <h3
                        className={`font-medium ${
                          crop.isAval ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {crop.name}
                      </h3>
                      <p
                        className={`text-xs ${
                          crop.isAval ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {crop.isAval ? "Active" : "Deactivated"}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="space-y-6">
            {/* Weather Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Weather</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="flex items-center gap-4">
                  <Sun className="h-16 w-16 text-yellow-500" />
                  <div>
                    <div className="text-5xl font-bold text-gray-900">
                      {mockWeather.temperature}°C
                    </div>
                    <p className="text-gray-600 text-center">
                      {mockWeather.condition}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  {mockWeather.location}
                </p>
                <div className="mt-2 text-blue-600 font-semibold flex items-center gap-1">
                  <Droplets className="h-4 w-4" />
                  <span>{mockWeather.humidity}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Scans</span>
                    <span className="font-bold text-blue-600 text-base">
                      127
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Healthy Plants</span>
                    <span className="font-bold text-green-600 text-base">
                      89%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Diseases Detected</span>
                    <span className="font-bold text-blue-600 text-base">
                      14
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-bold text-blue-600 text-base">
                      23
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scanning Tips Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Scanning Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-yellow-700 list-disc list-inside">
                <li>Use good lighting for better results</li>
                <li>Focus on one leaf at a time</li>
                <li>Avoid shadows and blurred images</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
