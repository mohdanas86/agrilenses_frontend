"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  ThermometerSun,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Leaf,
  Activity,
  Eye,
  ArrowLeft,
  Gauge,
  Zap,
  CloudSnow,
  CloudDrizzle,
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import apiService from "@/lib/api-service";
import { useUser } from "@clerk/nextjs";

// Enhanced weather interfaces for WeatherAPI.com data
interface EnhancedWeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    humidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_kph: number;
    gust_mph: number;
  };
  air_quality?: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    us_epa_index: number;
    gb_defra_index: number;
  };
}

interface EnhancedForecastData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_kph: number;
        maxwind_mph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_kph: number;
        wind_mph: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        gust_kph: number;
        gust_mph: number;
        uv: number;
      }>;
    }>;
  };
}

interface EnhancedWeatherAdvisory {
  location: string;
  advisory: string;
  recommendations: string[];
  alert_level: string;
  pest_risk: {
    aphids: string;
    fungal_diseases: string;
    bacterial_diseases: string;
    viral_diseases: string;
  };
  crop_specific_advice: {
    potato: string[];
    tomato: string[];
    general: string[];
  };
  weather_warnings: string[];
}

const WeatherIcon = ({ condition, size = "h-8 w-8" }: { condition: string; size?: string }) => {
  // Handle undefined or null condition
  if (!condition || typeof condition !== "string") {
    return <Sun className={`${size} text-yellow-500`} />;
  }

  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
    return <CloudRain className={`${size} text-blue-500`} />;
  } else if (conditionLower.includes("drizzle")) {
    return <CloudDrizzle className={`${size} text-blue-400`} />;
  } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
    return <CloudSnow className={`${size} text-blue-200`} />;
  } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return <Cloud className={`${size} text-gray-500`} />;
  } else if (conditionLower.includes("wind")) {
    return <Wind className={`${size} text-gray-600`} />;
  } else if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return <Sun className={`${size} text-yellow-500`} />;
  } else {
    return <Sun className={`${size} text-yellow-500`} />;
  }
};

const AirQualityBadge = ({ aqi }: { aqi: number }) => {
  const getAQIInfo = (index: number) => {
    if (index <= 50) return { level: 'Good', color: 'bg-green-100 text-green-800' };
    if (index <= 100) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    if (index <= 150) return { level: 'Unhealthy for Sensitive', color: 'bg-orange-100 text-orange-800' };
    if (index <= 200) return { level: 'Unhealthy', color: 'bg-red-100 text-red-800' };
    if (index <= 300) return { level: 'Very Unhealthy', color: 'bg-purple-100 text-purple-800' };
    return { level: 'Hazardous', color: 'bg-red-900 text-red-100' };
  };

  const { level, color } = getAQIInfo(aqi);
  return <Badge className={color}>{level} ({aqi})</Badge>;
};

const WeatherCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = "text-blue-600",
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  trend?: number;
  color?: string;
}) => (
  <Card className="border border-gray-200 shadow-sm bg-white">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <TrendingUp
                className={`h-3 w-3 mr-1 ${
                  trend >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-xs ${
                  trend >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 bg-blue-50 rounded-lg`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function WeatherPage() {
  const { user } = useUser();
  const [currentWeather, setCurrentWeather] = useState<EnhancedWeatherData | null>(null);
  const [forecast, setForecast] = useState<EnhancedForecastData | null>(null);
  const [advisory, setAdvisory] = useState<EnhancedWeatherAdvisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("Delhi");

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [currentData, forecastData, advisoryData] =
        await Promise.allSettled([
          apiService.getCurrentWeather(location),
          apiService.getWeatherForecast(location),
          apiService.getWeatherAdvisory(location),
        ]);

      if (currentData.status === "fulfilled") {
        setCurrentWeather(currentData.value);
      }

      if (forecastData.status === "fulfilled") {
        setForecast(forecastData.value);
      }

      if (advisoryData.status === "fulfilled") {
        setAdvisory(advisoryData.value);
      }
    } catch (err) {
      console.error("Failed to load weather data:", err);
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getAlertColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cloud className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Weather Monitoring
                    </h1>
                    <p className="text-gray-600">
                      Real-time weather data and agricultural advisories
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {location}
                  </span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BackButton title="" />
                <Button
                  variant="outline"
                  onClick={loadWeatherData}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Current Weather */}
        {currentWeather && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <WeatherCard
                title="Temperature"
                value={currentWeather.current.temp_c}
                unit="°C"
                icon={ThermometerSun}
                color="text-orange-600"
              />
              <WeatherCard
                title="Humidity"
                value={currentWeather.current.humidity}
                unit="%"
                icon={Droplets}
                color="text-blue-600"
              />
              <WeatherCard
                title="Wind Speed"
                value={currentWeather.current.wind_kph}
                unit="km/h"
                icon={Wind}
                color="text-gray-600"
              />
              <WeatherCard
                title="UV Index"
                value={currentWeather.current.uv}
                icon={Zap}
                color="text-yellow-600"
              />
              <WeatherCard
                title="Visibility"
                value={currentWeather.current.vis_km}
                unit="km"
                icon={Eye}
                color="text-purple-600"
              />
            </div>

            {/* Air Quality and Additional Info */}
            {currentWeather.air_quality && (
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5 text-green-600" />
                    <span>Air Quality & Environmental Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Air Quality Index</p>
                      <AirQualityBadge aqi={currentWeather.air_quality.us_epa_index} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Pressure</p>
                      <p className="text-lg font-bold text-gray-900">{currentWeather.current.pressure_mb} mb</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Precipitation</p>
                      <p className="text-lg font-bold text-gray-900">{currentWeather.current.precip_mm} mm</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Wind Direction</p>
                      <p className="text-lg font-bold text-gray-900">{currentWeather.current.wind_dir}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weather Forecast */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>7-Day Forecast</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {forecast?.forecast?.forecastday && forecast.forecast.forecastday.length > 0 ? (
                <div className="space-y-3">
                  {forecast.forecast.forecastday.slice(0, 3).map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <WeatherIcon condition={day.day.condition.text} size="h-6 w-6" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {day.day.condition.text}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {day.day.maxtemp_c}°C / {day.day.mintemp_c}°C
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>💧 {day.day.avghumidity}%</span>
                          <span>🌪️ {day.day.maxwind_kph} km/h</span>
                          <span>☀️ UV {day.day.uv}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Forecast data unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather Advisory */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Agricultural Advisory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {advisory ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getAlertColor(advisory.alert_level)}>
                      {advisory.alert_level.toUpperCase()} ALERT
                    </Badge>
                    <span className="text-sm text-gray-600">Agricultural Advisory</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Current Advisory
                    </h3>
                    <p className="text-gray-700">{advisory.advisory}</p>
                  </div>

                  {/* Pest Risk Assessment */}
                  {advisory.pest_risk && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Pest Risk Assessment</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Aphids:</span>
                          <Badge className={`text-xs ${advisory.pest_risk.aphids === 'high' ? 'bg-red-100 text-red-800' : advisory.pest_risk.aphids === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {advisory.pest_risk.aphids}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Fungal:</span>
                          <Badge className={`text-xs ${advisory.pest_risk.fungal_diseases === 'high' ? 'bg-red-100 text-red-800' : advisory.pest_risk.fungal_diseases === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {advisory.pest_risk.fungal_diseases}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Bacterial:</span>
                          <Badge className={`text-xs ${advisory.pest_risk.bacterial_diseases === 'high' ? 'bg-red-100 text-red-800' : advisory.pest_risk.bacterial_diseases === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {advisory.pest_risk.bacterial_diseases}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Viral:</span>
                          <Badge className={`text-xs ${advisory.pest_risk.viral_diseases === 'high' ? 'bg-red-100 text-red-800' : advisory.pest_risk.viral_diseases === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {advisory.pest_risk.viral_diseases}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Crop-Specific Advice */}
                  {advisory.crop_specific_advice && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Crop-Specific Recommendations</h3>
                      <div className="space-y-3">
                        {advisory.crop_specific_advice.potato.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">🥔 Potato:</h4>
                            <ul className="space-y-1">
                              {advisory.crop_specific_advice.potato.map((advice, index) => (
                                <li key={index} className="text-sm text-gray-600 ml-4">• {advice}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {advisory.crop_specific_advice.tomato.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">🍅 Tomato:</h4>
                            <ul className="space-y-1">
                              {advisory.crop_specific_advice.tomato.map((advice, index) => (
                                <li key={index} className="text-sm text-gray-600 ml-4">• {advice}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Weather Warnings */}
                  {advisory.weather_warnings && advisory.weather_warnings.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-700 mb-2">⚠️ Weather Warnings</h3>
                      <ul className="space-y-1">
                        {advisory.weather_warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {advisory.recommendations && advisory.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        General Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {advisory.recommendations.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Leaf className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Advisory data unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Weather-Based Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/scanner">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Plant Scan</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Check plant health with current weather context
                    </span>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/market">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Market Prices</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      View weather impact on crop prices
                    </span>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/history">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Weather History</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Review past weather and scan correlations
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
