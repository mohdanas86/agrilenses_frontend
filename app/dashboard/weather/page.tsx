"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Calendar,
  RefreshCw,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Sun,
  CloudRain,
  Cloud,
  CloudSnow,
  Zap,
  Sunrise,
  Sunset,
  Navigation,
  Gauge,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Leaf,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useGlobalContext } from "@/context/GlobalContext";

// Mock weather data structure
interface WeatherData {
  id: string;
  location: string;
  state: string;
  coordinates: { lat: number; lng: number };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
    description: string;
    lastUpdated: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    precipitationChance: number;
  }>;
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
    icon: string;
    windSpeed: number;
    humidity: number;
    precipitation: number;
  }>;
  agricultural: {
    soilMoisture: number;
    evapotranspiration: number;
    growingDegreeDays: number;
    pestRisk: "low" | "medium" | "high";
    diseaseRisk: "low" | "medium" | "high";
    irrigationAdvice: string;
    fieldWorkSuitability: "excellent" | "good" | "fair" | "poor";
    recommendations: string[];
  };
  alerts: Array<{
    id: string;
    type: "warning" | "watch" | "advisory";
    severity: "low" | "medium" | "high" | "extreme";
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  }>;
}

// Mock weather data
const mockWeatherData: WeatherData[] = [
  {
    id: "1",
    location: "New Delhi",
    state: "Delhi",
    coordinates: { lat: 28.6139, lng: 77.209 },
    current: {
      temperature: 18,
      feelsLike: 16,
      humidity: 68,
      windSpeed: 12,
      windDirection: "NW",
      pressure: 1018,
      visibility: 8,
      uvIndex: 3,
      condition: "Partly Cloudy",
      icon: "⛅",
      description: "Partly cloudy with light winds",
      lastUpdated: "2024-12-25 10:30 AM",
    },
    forecast: [
      {
        date: "2024-12-25",
        day: "Today",
        high: 22,
        low: 12,
        condition: "Partly Cloudy",
        icon: "⛅",
        humidity: 65,
        windSpeed: 10,
        precipitation: 0,
        precipitationChance: 10,
      },
      {
        date: "2024-12-26",
        day: "Tomorrow",
        high: 24,
        low: 14,
        condition: "Sunny",
        icon: "☀️",
        humidity: 55,
        windSpeed: 8,
        precipitation: 0,
        precipitationChance: 5,
      },
      {
        date: "2024-12-27",
        day: "Thursday",
        high: 25,
        low: 15,
        condition: "Sunny",
        icon: "☀️",
        humidity: 50,
        windSpeed: 9,
        precipitation: 0,
        precipitationChance: 0,
      },
      {
        date: "2024-12-28",
        day: "Friday",
        high: 26,
        low: 16,
        condition: "Partly Cloudy",
        icon: "⛅",
        humidity: 58,
        windSpeed: 11,
        precipitation: 0,
        precipitationChance: 15,
      },
      {
        date: "2024-12-29",
        day: "Saturday",
        high: 23,
        low: 13,
        condition: "Cloudy",
        icon: "☁️",
        humidity: 72,
        windSpeed: 14,
        precipitation: 2,
        precipitationChance: 40,
      },
      {
        date: "2024-12-30",
        day: "Sunday",
        high: 21,
        low: 11,
        condition: "Light Rain",
        icon: "🌦️",
        humidity: 85,
        windSpeed: 16,
        precipitation: 8,
        precipitationChance: 80,
      },
      {
        date: "2024-12-31",
        day: "Monday",
        high: 19,
        low: 9,
        condition: "Light Rain",
        icon: "🌦️",
        humidity: 88,
        windSpeed: 18,
        precipitation: 12,
        precipitationChance: 90,
      },
    ],
    hourly: [
      {
        time: "6 AM",
        temperature: 14,
        condition: "Clear",
        icon: "🌙",
        windSpeed: 8,
        humidity: 75,
        precipitation: 0,
      },
      {
        time: "9 AM",
        temperature: 16,
        condition: "Partly Cloudy",
        icon: "⛅",
        windSpeed: 10,
        humidity: 70,
        precipitation: 0,
      },
      {
        time: "12 PM",
        temperature: 20,
        condition: "Partly Cloudy",
        icon: "⛅",
        windSpeed: 12,
        humidity: 65,
        precipitation: 0,
      },
      {
        time: "3 PM",
        temperature: 22,
        condition: "Partly Cloudy",
        icon: "⛅",
        windSpeed: 14,
        humidity: 60,
        precipitation: 0,
      },
      {
        time: "6 PM",
        temperature: 19,
        condition: "Cloudy",
        icon: "☁️",
        windSpeed: 11,
        humidity: 68,
        precipitation: 0,
      },
      {
        time: "9 PM",
        temperature: 16,
        condition: "Cloudy",
        icon: "☁️",
        windSpeed: 9,
        humidity: 72,
        precipitation: 0,
      },
    ],
    agricultural: {
      soilMoisture: 65,
      evapotranspiration: 3.2,
      growingDegreeDays: 8.5,
      pestRisk: "low",
      diseaseRisk: "medium",
      irrigationAdvice: "Light irrigation recommended for dry areas",
      fieldWorkSuitability: "good",
      recommendations: [
        "Good conditions for planting winter crops",
        "Monitor for fungal diseases due to humidity",
        "Apply fertilizers in the morning hours",
        "Cover sensitive plants during night",
      ],
    },
    alerts: [
      {
        id: "1",
        type: "advisory",
        severity: "low",
        title: "Cold Wave Advisory",
        description: "Minimum temperatures may drop below 10°C in some areas",
        startTime: "2024-12-30 00:00",
        endTime: "2024-12-31 12:00",
      },
    ],
  },
  {
    id: "2",
    location: "Mumbai",
    state: "Maharashtra",
    coordinates: { lat: 19.076, lng: 72.8777 },
    current: {
      temperature: 28,
      feelsLike: 32,
      humidity: 78,
      windSpeed: 15,
      windDirection: "SW",
      pressure: 1012,
      visibility: 6,
      uvIndex: 7,
      condition: "Humid",
      icon: "🌤️",
      description: "Warm and humid with sea breeze",
      lastUpdated: "2024-12-25 10:45 AM",
    },
    forecast: [
      {
        date: "2024-12-25",
        day: "Today",
        high: 32,
        low: 24,
        condition: "Partly Cloudy",
        icon: "⛅",
        humidity: 75,
        windSpeed: 15,
        precipitation: 0,
        precipitationChance: 20,
      },
      {
        date: "2024-12-26",
        day: "Tomorrow",
        high: 33,
        low: 25,
        condition: "Sunny",
        icon: "☀️",
        humidity: 70,
        windSpeed: 12,
        precipitation: 0,
        precipitationChance: 10,
      },
      {
        date: "2024-12-27",
        day: "Thursday",
        high: 34,
        low: 26,
        condition: "Hot",
        icon: "🌞",
        humidity: 65,
        windSpeed: 10,
        precipitation: 0,
        precipitationChance: 5,
      },
      {
        date: "2024-12-28",
        day: "Friday",
        high: 35,
        low: 27,
        condition: "Hot",
        icon: "🌞",
        humidity: 68,
        windSpeed: 11,
        precipitation: 0,
        precipitationChance: 15,
      },
      {
        date: "2024-12-29",
        day: "Saturday",
        high: 33,
        low: 25,
        condition: "Cloudy",
        icon: "☁️",
        humidity: 80,
        windSpeed: 18,
        precipitation: 5,
        precipitationChance: 60,
      },
      {
        date: "2024-12-30",
        day: "Sunday",
        high: 30,
        low: 23,
        condition: "Thunderstorms",
        icon: "⛈️",
        humidity: 90,
        windSpeed: 22,
        precipitation: 25,
        precipitationChance: 85,
      },
      {
        date: "2024-12-31",
        day: "Monday",
        high: 29,
        low: 22,
        condition: "Heavy Rain",
        icon: "🌧️",
        humidity: 95,
        windSpeed: 25,
        precipitation: 45,
        precipitationChance: 95,
      },
    ],
    hourly: [
      {
        time: "6 AM",
        temperature: 25,
        condition: "Clear",
        icon: "🌅",
        windSpeed: 12,
        humidity: 82,
        precipitation: 0,
      },
      {
        time: "9 AM",
        temperature: 28,
        condition: "Sunny",
        icon: "☀️",
        windSpeed: 14,
        humidity: 78,
        precipitation: 0,
      },
      {
        time: "12 PM",
        temperature: 31,
        condition: "Hot",
        icon: "🌞",
        windSpeed: 16,
        humidity: 75,
        precipitation: 0,
      },
      {
        time: "3 PM",
        temperature: 32,
        condition: "Hot",
        icon: "🌞",
        windSpeed: 18,
        humidity: 72,
        precipitation: 0,
      },
      {
        time: "6 PM",
        temperature: 29,
        condition: "Partly Cloudy",
        icon: "⛅",
        windSpeed: 15,
        humidity: 76,
        precipitation: 0,
      },
      {
        time: "9 PM",
        temperature: 27,
        condition: "Clear",
        icon: "🌙",
        windSpeed: 13,
        humidity: 80,
        precipitation: 0,
      },
    ],
    agricultural: {
      soilMoisture: 85,
      evapotranspiration: 5.8,
      growingDegreeDays: 18.2,
      pestRisk: "high",
      diseaseRisk: "high",
      irrigationAdvice: "Reduce irrigation due to high humidity",
      fieldWorkSuitability: "fair",
      recommendations: [
        "Monitor crops for pest infestations",
        "Increase fungicide applications",
        "Harvest mature crops before rain",
        "Ensure proper drainage in fields",
      ],
    },
    alerts: [
      {
        id: "2",
        type: "warning",
        severity: "medium",
        title: "Thunderstorm Warning",
        description: "Thunderstorms with heavy rain expected from Dec 30-31",
        startTime: "2024-12-30 06:00",
        endTime: "2024-12-31 18:00",
      },
    ],
  },
];

// Function to convert API data to our WeatherData format
const convertApiToWeatherData = (apiData: any): WeatherData => {
  if (!apiData || !apiData.current || !apiData.location) {
    return mockWeatherData[0]; // Fallback to Chennai mock data
  }

  const current = apiData.current;
  const location = apiData.location;

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, isDay: number) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return isDay ? "☀️" : "🌙";
    } else if (conditionLower.includes("cloud")) {
      return conditionLower.includes("partly") ? "⛅" : "☁️";
    } else if (conditionLower.includes("rain")) {
      return "🌦️";
    } else if (conditionLower.includes("storm")) {
      return "⛈️";
    } else if (conditionLower.includes("snow")) {
      return "❄️";
    } else if (
      conditionLower.includes("mist") ||
      conditionLower.includes("fog")
    ) {
      return "🌫️";
    }
    return "🌤️";
  };

  return {
    id: "api-data",
    location: location.name,
    state: location.region,
    coordinates: { lat: location.lat, lng: location.lon },
    current: {
      temperature: Math.round(current.temp_c),
      feelsLike: Math.round(current.feelslike_c),
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_kph),
      windDirection: current.wind_dir,
      pressure: Math.round(current.pressure_mb),
      visibility: Math.round(current.vis_km),
      uvIndex: current.uv,
      condition: current.condition.text,
      icon: getWeatherIcon(current.condition.text, current.is_day),
      description: current.condition.text,
      lastUpdated: current.last_updated,
    },
    forecast: mockWeatherData[0].forecast, // Use mock forecast data for now
    hourly: mockWeatherData[0].hourly, // Use mock hourly data for now
    agricultural: {
      soilMoisture: current.humidity > 70 ? 75 : 60,
      evapotranspiration: current.temp_c > 25 ? 4.5 : 3.2,
      growingDegreeDays: Math.max(0, (current.temp_c - 10) * 0.5),
      pestRisk:
        current.humidity > 80
          ? "high"
          : current.humidity > 60
          ? "medium"
          : "low",
      diseaseRisk:
        current.humidity > 85
          ? "high"
          : current.humidity > 70
          ? "medium"
          : "low",
      irrigationAdvice:
        current.humidity > 80
          ? "Reduce irrigation due to high humidity"
          : current.humidity < 50
          ? "Increase irrigation due to low humidity"
          : "Normal irrigation schedule recommended",
      fieldWorkSuitability:
        current.wind_kph > 20
          ? "poor"
          : current.temp_c > 35
          ? "fair"
          : current.humidity > 90
          ? "fair"
          : "good",
      recommendations: [
        current.temp_c > 30
          ? "Protect crops from heat stress"
          : "Good conditions for crop growth",
        current.humidity > 80
          ? "Monitor for fungal diseases"
          : "Low disease pressure expected",
        current.wind_kph > 15
          ? "Secure lightweight structures"
          : "Calm conditions for field work",
        current.uv > 7
          ? "Provide shade for sensitive crops"
          : "Normal UV levels",
      ].filter((rec) => rec !== null),
    },
    alerts: [], // No alerts from basic weather API
  };
};

export default function WeatherPage() {
  const {
    weatherData: apiWeatherData,
    weatherCity,
    setWeatherCity,
  } = useGlobalContext();
  const [weatherData, setWeatherData] =
    useState<WeatherData[]>(mockWeatherData);
  const [selectedLocation, setSelectedLocation] = useState<WeatherData>(
    mockWeatherData[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] =
    useState<WeatherData[]>(mockWeatherData);
  const [currentView, setCurrentView] = useState<
    "current" | "forecast" | "hourly" | "agricultural"
  >("current");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isApiData, setIsApiData] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update weather data when API data changes
  useEffect(() => {
    if (apiWeatherData) {
      try {
        const convertedData = convertApiToWeatherData(apiWeatherData);
        const updatedWeatherData = [convertedData, ...mockWeatherData.slice(1)];
        setWeatherData(updatedWeatherData);
        setSelectedLocation(convertedData);
        setIsApiData(true);
      } catch (error) {
        console.error("Error converting API data:", error);
        // Fallback to mock data
        setWeatherData(mockWeatherData);
        setSelectedLocation(mockWeatherData[0]);
        setIsApiData(false);
      }
    } else {
      // Use mock data when no API data
      setWeatherData(mockWeatherData);
      setSelectedLocation(mockWeatherData[0]);
      setIsApiData(false);
    }
  }, [apiWeatherData]);

  // Filter locations based on search
  useEffect(() => {
    const filtered = weatherData.filter(
      (location) =>
        location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [weatherData, searchTerm]);

  const refreshWeather = async () => {
    setLastRefresh(new Date());
    try {
      // Trigger a refresh by changing the city (this will trigger the useEffect in GlobalContext)
      if (setWeatherCity) {
        const currentCity = weatherCity || "chennai";
        setWeatherCity(currentCity); // This will trigger a re-fetch in GlobalContext
      }
      console.log("Refreshing weather data...");
    } catch (error) {
      console.error("Error refreshing weather:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agricultural Weather
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive weather information and agricultural advisories for
            farmers
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div
              className={`h-2 w-2 rounded-full ${
                isApiData ? "bg-green-500" : "bg-orange-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isApiData ? "Live Weather Data" : "Mock Data (Chennai)"}
            </span>
          </div>
        </div>

        {/* Location Search and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter city name (e.g., Chennai, Mumbai, Delhi)"
                value={weatherCity || ""}
                onChange={(e) => {
                  if (setWeatherCity) {
                    setWeatherCity(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && weatherCity) {
                    refreshWeather();
                  }
                }}
                className="pl-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={refreshWeather}
              className="flex items-center gap-2 h-12"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Location Selector */}
          <div className="flex flex-wrap gap-2">
            {filteredLocations.map((location) => (
              <Button
                key={location.id}
                variant={
                  selectedLocation.id === location.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedLocation(location)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {location.location}
              </Button>
            ))}
          </div>

          {/* View Selector */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentView === "current" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("current")}
            >
              Current Weather
            </Button>
            <Button
              variant={currentView === "forecast" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("forecast")}
            >
              7-Day Forecast
            </Button>
            <Button
              variant={currentView === "hourly" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("hourly")}
            >
              Hourly
            </Button>
            <Button
              variant={currentView === "agricultural" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentView("agricultural")}
            >
              Agricultural Advisory
            </Button>
          </div>
        </div>

        {/* Weather Alerts */}
        {selectedLocation.alerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Weather Alerts
            </h2>
            <div className="space-y-2">
              {selectedLocation.alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {alert.startTime} - {alert.endTime}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather View */}
        {currentView === "current" && (
          <div className="space-y-6">
            {/* Current Conditions */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      {selectedLocation.location}, {selectedLocation.state}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {selectedLocation.current.condition} •{" "}
                      {selectedLocation.current.description}
                    </CardDescription>
                  </div>
                  <div className="text-6xl">
                    {selectedLocation.current.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {selectedLocation.current.temperature}°C
                    </div>
                    <p className="text-gray-600">Temperature</p>
                    <p className="text-sm text-gray-500">
                      Feels like {selectedLocation.current.feelsLike}°C
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-semibold">
                          {selectedLocation.current.humidity}%
                        </p>
                        <p className="text-sm text-gray-600">Humidity</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wind className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-semibold">
                          {selectedLocation.current.windSpeed} km/h
                        </p>
                        <p className="text-sm text-gray-600">
                          Wind {selectedLocation.current.windDirection}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-semibold">
                          {selectedLocation.current.pressure} hPa
                        </p>
                        <p className="text-sm text-gray-600">Pressure</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-semibold">
                          {selectedLocation.current.visibility} km
                        </p>
                        <p className="text-sm text-gray-600">Visibility</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold">
                          UV Index {selectedLocation.current.uvIndex}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedLocation.current.uvIndex <= 2
                            ? "Low"
                            : selectedLocation.current.uvIndex <= 5
                            ? "Moderate"
                            : selectedLocation.current.uvIndex <= 7
                            ? "High"
                            : "Very High"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-semibold">Last Updated</p>
                        <p className="text-xs text-gray-600">
                          {selectedLocation.current.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 7-Day Forecast View */}
        {currentView === "forecast" && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  7-Day Weather Forecast
                </CardTitle>
                <CardDescription>
                  Extended weather outlook for {selectedLocation.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedLocation.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{day.icon}</div>
                        <div>
                          <p className="font-semibold">{day.day}</p>
                          <p className="text-sm text-gray-600">
                            {day.condition}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-lg font-bold">
                            {day.high}°/{day.low}°
                          </p>
                          <p className="text-xs text-gray-600">High/Low</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {day.precipitationChance}%
                          </p>
                          <p className="text-xs text-gray-600">Rain</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {day.windSpeed} km/h
                          </p>
                          <p className="text-xs text-gray-600">Wind</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-semibold">
                            {day.humidity}%
                          </p>
                          <p className="text-xs text-gray-600">Humidity</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hourly View */}
        {currentView === "hourly" && (
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                  Today's Hourly Forecast
                </CardTitle>
                <CardDescription>
                  Hour-by-hour weather for {selectedLocation.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedLocation.hourly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="time"
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fill: "#6b7280" }}
                        domain={["dataMin - 2", "dataMax + 2"]}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}°C`,
                          "Temperature",
                        ]}
                        labelFormatter={(label) => `Time: ${label}`}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                        activeDot={{
                          r: 7,
                          stroke: "#3b82f6",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {selectedLocation.hourly.map((hour, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="text-sm font-semibold mb-2">{hour.time}</p>
                      <div className="text-2xl mb-2">{hour.icon}</div>
                      <p className="text-lg font-bold text-blue-600 mb-1">
                        {hour.temperature}°C
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {hour.condition}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs">💨 {hour.windSpeed} km/h</p>
                        <p className="text-xs">💧 {hour.humidity}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Agricultural Advisory View */}
        {currentView === "agricultural" && (
          <div className="space-y-6">
            {/* Agricultural Metrics */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                  Agricultural Conditions
                </CardTitle>
                <CardDescription>
                  Field conditions and farming metrics for{" "}
                  {selectedLocation.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Soil Moisture</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedLocation.agricultural.soilMoisture}%
                    </p>
                    <p className="text-sm text-gray-600">
                      Optimal range: 60-80%
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Evapotranspiration</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedLocation.agricultural.evapotranspiration} mm
                    </p>
                    <p className="text-sm text-gray-600">Daily water loss</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold">Growing Degree Days</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedLocation.agricultural.growingDegreeDays}
                    </p>
                    <p className="text-sm text-gray-600">
                      Accumulated heat units
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold">Field Work</span>
                    </div>
                    <Badge
                      className={getSuitabilityColor(
                        selectedLocation.agricultural.fieldWorkSuitability
                      )}
                    >
                      {selectedLocation.agricultural.fieldWorkSuitability
                        .charAt(0)
                        .toUpperCase() +
                        selectedLocation.agricultural.fieldWorkSuitability.slice(
                          1
                        )}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">Suitability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Pest and disease risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Pest Risk</span>
                      <Badge
                        className={getRiskColor(
                          selectedLocation.agricultural.pestRisk
                        )}
                      >
                        {selectedLocation.agricultural.pestRisk.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Disease Risk</span>
                      <Badge
                        className={getRiskColor(
                          selectedLocation.agricultural.diseaseRisk
                        )}
                      >
                        {selectedLocation.agricultural.diseaseRisk.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      Irrigation Advice
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedLocation.agricultural.irrigationAdvice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Agricultural Recommendations
                </CardTitle>
                <CardDescription>
                  Expert advice for current conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedLocation.agricultural.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">
                          {recommendation}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Last Update Info */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Last refreshed:{" "}
          {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"} • Data
          updates every 15 minutes
        </div>
      </div>
    </div>
  );
}
