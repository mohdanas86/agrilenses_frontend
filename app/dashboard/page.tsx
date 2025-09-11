"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  TrendingUp,
  BarChart3,
  Activity,
  Shield,
  AlertTriangle,
  MessageCircle,
  Building2,
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
  Legend,
} from "recharts";
import { cropModels } from "./scanner/_components";
import { useGlobalContext } from "@/context/GlobalContext";
import { useHistoryState } from "./history/_components/useHistoryState";

// Types
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  location: string;
}

interface LineChartDataPoint {
  date: string;
  tomato: number;
  potato: number;
  tomatoCount: number;
  potatoCount: number;
}

interface BarChartDataPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// Mock data based on the design
const mockWeather: WeatherData = {
  temperature: 35,
  condition: "Partly Cloudy",
  humidity: 84,
  location: "Chennai, TN",
};

const supportedCrops = [
  { name: "Tomato", emoji: "🍅", count: 8, isAval: true },
  { name: "Potato", emoji: "🥔", count: 6, isAval: true },
  { name: "Rice", emoji: "🌾", count: 4, isAval: false },
  { name: "Wheat", emoji: "🌾", count: 3, isAval: false },
  { name: "Corn", emoji: "🌽", count: 5, isAval: false },
  { name: "Bell Pepper", emoji: "🫑", count: 4, isAval: false },
  { name: "Apple", emoji: "🍎", count: 3, isAval: false },
  { name: "Grape", emoji: "🍇", count: 2, isAval: false },
];

export default function AgriLensDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // ======================================
  // update model according to selected crop
  const { setSelectedCrop, weatherCity, setWeatherCity, weatherData } =
    useGlobalContext();

  // Get history data for charts
  const {
    scanHistory,
    getStats,
    isLoading: historyLoading,
  } = useHistoryState();

  // Process data for charts with memoization to prevent recalculation
  const { lineChartData, barChartData } = useMemo(() => {
    // Line chart data - group by date for tomato and potato disease detection
    const lineChartData: LineChartDataPoint[] = [];
    const last7Days = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toDateString(),
      });
    }

    // Process scan data for line chart - showing disease detection rates
    last7Days.forEach((day) => {
      const dayScans = scanHistory.filter(
        (scan) => scan.timestamp.toDateString() === day.fullDate
      );

      const tomatoScans = dayScans.filter((scan) =>
        scan.crop.toLowerCase().includes("tomato")
      );
      const potatoScans = dayScans.filter((scan) =>
        scan.crop.toLowerCase().includes("potato")
      );

      const tomatoDiseased = tomatoScans.filter(
        (scan) => !scan.isHealthy
      ).length;
      const potatoDiseased = potatoScans.filter(
        (scan) => !scan.isHealthy
      ).length;

      lineChartData.push({
        date: day.date,
        tomato: tomatoDiseased, // Number of diseased tomato plants
        potato: potatoDiseased, // Number of diseased potato plants
        tomatoCount: tomatoScans.length,
        potatoCount: potatoScans.length,
      });
    });

    // Bar chart data
    const healthyCount = scanHistory.filter((scan) => scan.isHealthy).length;
    const diseasedCount = scanHistory.filter((scan) => !scan.isHealthy).length;
    const totalCount = healthyCount + diseasedCount;

    const barChartData: BarChartDataPoint[] = [
      {
        name: "Healthy Plants",
        value: healthyCount,
        color: "#10b981",
        percentage:
          totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0,
      },
      {
        name: "Diseased Plants",
        value: diseasedCount,
        color: "#ef4444",
        percentage:
          totalCount > 0 ? Math.round((diseasedCount / totalCount) * 100) : 0,
      },
    ].filter((item) => item.value > 0); // Filter out empty data

    return { lineChartData, barChartData };
  }, [scanHistory]);

  const handleCropSelection = (crop: (typeof supportedCrops)[number]) => {
    try {
      const matchingModel = cropModels.find(
        (model) => model.name.toLowerCase() === crop.name.toLowerCase()
      );

      if (matchingModel) {
        // Use the global context to set the selected crop
        setSelectedCrop(matchingModel);
        // Navigate to scanner page after successful crop selection
        router.push("/dashboard/scanner");
      } else {
        console.log("No matching model found for crop:", crop.name);
      }
    } catch (err) {
      console.log("Error selecting crop model:", err);
    }
  };

  // ======================================

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
      <main className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome to AgriLenses
          </h1>
          <p className="text-sm sm:text-md text-gray-600 mt-1">
            AI-powered crop disease detection for healthier harvests
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {currentTime ? formatTime(currentTime) : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* === LEFT COLUMN === */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Priority 1: Quick Stats Overview - Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="shadow-md border-l-4 border-l-blue-500 bg-blue-50/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Total Scans
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-blue-600 mt-1">
                    {historyLoading ? "..." : getStats().totalScans}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-l-4 border-l-green-500 bg-green-50/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Healthy Plants
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1">
                    {historyLoading ? "..." : getStats().healthyCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-l-4 border-l-red-500 bg-red-50/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Diseases Found
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-red-600 mt-1">
                    {historyLoading ? "..." : getStats().diseasedCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md border-l-4 border-l-purple-500 bg-purple-50/30">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Success Rate
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold text-purple-600 mt-1">
                    {historyLoading ? "..." : `${getStats().successRate}%`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Priority 2: Analytics & Charts Section - Detailed Analysis */}
            <div className="space-y-4 sm:space-y-6">
              {/* Analytics Header */}
              <div className="flex items-center gap-2 border-l-4 border-l-green-500 pl-3">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Analytics & Trends
                </h2>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Line Chart - Tomato & Potato Disease Detection */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      Disease Detection Trends
                    </CardTitle>
                    <CardDescription>
                      Number of diseased plants detected in Tomato & Potato over
                      the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="flex items-center justify-center h-48 sm:h-64">
                        <div className="text-gray-500">Loading chart...</div>
                      </div>
                    ) : lineChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-48 sm:h-64">
                        <div className="text-center text-gray-500">
                          <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>No data available</div>
                          <div className="text-sm">
                            Start scanning plants to see trends
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-56 sm:h-72 lg:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={lineChartData}
                            margin={{
                              top: 20,
                              right: 20,
                              left: 10,
                              bottom: 40,
                            }}
                          >
                            <defs>
                              <linearGradient
                                id="tomatoGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#ef4444"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#ef4444"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                              <linearGradient
                                id="potatoGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f59e0b"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                              opacity={0.6}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              stroke="#6b7280"
                              fontSize={12}
                              tick={{ fill: "#6b7280" }}
                              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickMargin={10}
                              height={60}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={12}
                              domain={[0, "dataMax + 1"]}
                              label={{
                                value: "Diseased Plants",
                                angle: -90,
                                position: "insideLeft",
                                style: {
                                  textAnchor: "middle",
                                  fontSize: "12px",
                                  fill: "#6b7280",
                                },
                              }}
                              allowDecimals={false}
                              tick={{ fill: "#6b7280" }}
                              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickMargin={10}
                              width={60}
                            />
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} diseased plants`,
                                name === "tomato"
                                  ? "🍅 Tomato Diseases"
                                  : "🥔 Potato Diseases",
                              ]}
                              labelFormatter={(label) => `📅 ${label}`}
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                boxShadow:
                                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                padding: "12px 16px",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                              cursor={{
                                stroke: "#d1d5db",
                                strokeWidth: 1,
                                strokeDasharray: "5,5",
                              }}
                            />
                            <Legend
                              wrapperStyle={{
                                paddingTop: "20px",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                              iconType="circle"
                            />
                            <Line
                              type="monotone"
                              dataKey="tomato"
                              stroke="#ef4444"
                              strokeWidth={3}
                              dot={{
                                fill: "#ef4444",
                                strokeWidth: 2,
                                r: 4,
                                stroke: "#ffffff",
                              }}
                              activeDot={{
                                r: 6,
                                stroke: "#ef4444",
                                strokeWidth: 2,
                                fill: "#ffffff",
                              }}
                              name="Tomato Diseases"
                              connectNulls={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="potato"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{
                                fill: "#f59e0b",
                                strokeWidth: 2,
                                r: 4,
                                stroke: "#ffffff",
                              }}
                              activeDot={{
                                r: 6,
                                stroke: "#f59e0b",
                                strokeWidth: 2,
                                fill: "#ffffff",
                              }}
                              name="Potato Diseases"
                              connectNulls={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Bar Chart */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Plant Health Distribution
                    </CardTitle>
                    <CardDescription>
                      Overall health status of scanned plants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="flex items-center justify-center h-48 sm:h-64">
                        <div className="text-gray-500">Loading chart...</div>
                      </div>
                    ) : barChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-48 sm:h-64">
                        <div className="text-center text-gray-500">
                          <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>No data available</div>
                          <div className="text-sm">
                            Start scanning plants to see distribution
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-64 sm:h-72 lg:h-80 overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={barChartData}
                            margin={{
                              top: 10,
                              right: 10,
                              left: 10,
                              bottom: 20,
                            }}
                            maxBarSize={80}
                          >
                            <defs>
                              <linearGradient
                                id="healthyBarGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#10b981"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#10b981"
                                  stopOpacity={0.3}
                                />
                              </linearGradient>
                              <linearGradient
                                id="diseasedBarGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#ef4444"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#ef4444"
                                  stopOpacity={0.3}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                              opacity={0.6}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              stroke="#6b7280"
                              fontSize={10}
                              tick={{ fill: "#6b7280", fontSize: 10 }}
                              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              interval={0}
                              height={40}
                              textAnchor="middle"
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={10}
                              domain={[0, "dataMax + 2"]}
                              allowDecimals={false}
                              tick={{ fill: "#6b7280", fontSize: 10 }}
                              axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              tickLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
                              width={40}
                            />
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} (${
                                  barChartData.find(
                                    (item) => item.name === name
                                  )?.percentage || 0
                                }%)`,
                                name === "Healthy Plants"
                                  ? "🌱 Healthy"
                                  : "🚨 Diseased",
                              ]}
                              contentStyle={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                                fontSize: "12px",
                                maxWidth: "200px",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              radius={[4, 4, 0, 0]}
                              stroke="#ffffff"
                              strokeWidth={1}
                            >
                              {barChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    entry.name === "Healthy Plants"
                                      ? "url(#healthyBarGradient)"
                                      : "url(#diseasedBarGradient)"
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>

                        {/* Stats Summary */}
                        <div className="flex justify-center gap-4 sm:gap-6 mt-3 pt-3 border-t border-gray-200">
                          {barChartData.map((item, index) => (
                            <div key={index} className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <div
                                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded ${
                                    item.name === "Healthy Plants"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                ></div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                  {item.name === "Healthy Plants" ? "🌱" : "🚨"}
                                  <span className="hidden sm:inline">
                                    {" "}
                                    {item.name}
                                  </span>
                                  <span className="sm:hidden">
                                    {" "}
                                    {item.name.split(" ")[0]}
                                  </span>
                                </span>
                              </div>
                              <div className="text-lg sm:text-xl font-bold text-gray-900">
                                {item.value}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                                {item.percentage}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Priority 1: Scan Your Crop Card - Most Important */}
              <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg border-2 border-green-400">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 p-3 rounded-full shadow-lg">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Start Disease Detection
                    </h2>
                    <p className="text-green-100 mt-1 font-medium">
                      Take a photo of your crop leaf for instant AI-powered
                      disease detection and get treatment recommendations
                      immediately
                    </p>
                  </div>
                </div>
                <Link href={"/dashboard/scanner"} className="currsor-pointer">
                  <Button
                    size="lg"
                    className="w-full bg-white text-green-700 hover:bg-green-50 font-bold text-lg mt-4 py-6 flex justify-between items-center cursor-pointer shadow-md"
                    // onClick={() => router.push("/dashboard/scanner")}
                  >
                    Start Scanning Now
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>

              {/* NEW: AI Chat Assistant Card */}
              <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg border-2 border-blue-400">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-3 rounded-full shadow-lg">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">AI Farm Advisor</h2>
                    <p className="text-blue-100 mt-1 font-medium">
                      Get instant expert farming advice in English, Hindi, or
                      Tamil with voice support
                    </p>
                  </div>
                </div>
                <Link href={"/dashboard/chat"} className="cursor-pointer">
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold text-lg mt-4 py-6 flex justify-between items-center cursor-pointer shadow-md"
                  >
                    Start Chatting
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Priority 3: Select Your Crop Card - Essential for Scanning */}
            <Card className="shadow-md border border-green-200">
              <CardHeader className="bg-green-50/50">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800">
                    Select Your Crop
                  </CardTitle>
                </div>
                <CardDescription className="text-green-700">
                  Choose from our supported crops for accurate disease detection
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-400"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.name}
                      onClick={() => handleCropSelection(crop)}
                      className={`cursor-pointer group p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                        crop.isAval
                          ? "hover:border-green-500 hover:bg-green-50 border-green-200 hover:shadow-md"
                          : "border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed"
                      }`}
                      disabled={!crop.isAval}
                    >
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-3xl sm:text-4xl mb-2">
                          {crop.emoji}
                        </div>
                      </div>
                      <h3
                        className={`font-semibold text-sm sm:text-base ${
                          crop.isAval ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {crop.name}
                      </h3>
                      <p
                        className={`text-xs font-medium ${
                          crop.isAval ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {crop.isAval ? "Active" : "Coming Soon..."}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority 4: Recent Activity - What's Happening Now */}
            <Card className="shadow-md border border-indigo-200">
              <CardHeader className="bg-indigo-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  Recent Scan Activity
                </CardTitle>
                <CardDescription className="text-indigo-700">
                  Latest plant health scans and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">
                      Loading recent activity...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {scanHistory.slice(0, 5).map((scan, index) => (
                      <div
                        key={scan.id}
                        className="flex items-center gap-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${
                            scan.isHealthy ? "bg-green-500" : "bg-red-500"
                          } shadow-sm`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {scan.crop}
                              </p>
                              <p
                                className={`text-sm font-medium ${
                                  scan.isHealthy
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {scan.isHealthy
                                  ? "Healthy"
                                  : `${scan.disease || "Disease detected"}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900">
                                {Math.round(scan.confidence * 100)}%
                              </p>
                              <p className="text-xs text-gray-500">
                                {scan.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {scanHistory.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="font-medium">
                          No recent scans available
                        </div>
                        <div className="text-sm">
                          Start scanning to see activity here!
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* === RIGHT COLUMN === */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Priority 2: Enhanced Weather Card - Environmental Context */}
            <Card className="shadow-lg border border-blue-200">
              <CardHeader className="pb-2 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* <Thermometer className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /> */}
                    <CardTitle className="text-base sm:text-lg text-blue-800">
                      Current Weather
                    </CardTitle>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {weatherData?.current?.last_updated || "Live"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Main Temperature Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {weatherData?.current?.temp_c ||
                          mockWeather.temperature}
                        °C
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Feels like {weatherData?.current?.feelslike_c || "36.7"}
                        °C
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location and Condition */}
                <div className="text-center py-2 border-y border-blue-200">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {weatherData?.location?.name || "Chennai"},{" "}
                    {weatherData?.location?.region || "Tamil Nadu"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {weatherData?.current?.condition?.text || "Mist"}
                  </p>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
                    <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Humidity</p>
                      <p className="font-semibold">
                        {weatherData?.current?.humidity || "84"}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-gray-500">Wind</p>
                      <p className="font-semibold">
                        {weatherData?.current?.wind_kph || "18.7"} kph
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
                    <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Rainfall</p>
                      <p className="font-semibold">
                        {weatherData?.current?.precip_mm || "0.0"} mm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="text-gray-500">Visibility</p>
                      <p className="font-semibold">
                        {weatherData?.current?.vis_km || "5.0"} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wind Direction */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Wind Direction: {weatherData?.current?.wind_dir || "South"}(
                    {weatherData?.current?.wind_degree || "188"}°)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Priority 3: Quick Access to New Features */}
            <Card className="shadow-md border border-indigo-200">
              <CardHeader className="bg-indigo-50/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                  Quick Access
                </CardTitle>
                <CardDescription className="text-indigo-700">
                  Essential tools and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {/* Government Schemes Card */}
                  <Link href="/dashboard/schemes">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-semibold text-blue-800">
                            Government Schemes
                          </h4>
                          <p className="text-xs text-blue-600">
                            SHC, PMFBY, eNAM, KCC & more
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-blue-400" />
                      </div>
                    </Button>
                  </Link>

                  {/* Market Prices Card */}
                  <Link href="/dashboard/market">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-semibold text-green-800">
                            Market Prices
                          </h4>
                          <p className="text-xs text-green-600">
                            Live rates from major mandis
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-green-400" />
                      </div>
                    </Button>
                  </Link>

                  {/* Weather Advisory Card */}
                  <Link href="/dashboard/weather">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 hover:border-orange-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Sun className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-semibold text-orange-800">
                            Weather Advisory
                          </h4>
                          <p className="text-xs text-orange-600">
                            Agricultural weather insights
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-orange-400" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Priority 4: Quick Action Stats - Live Data */}
            <Card className="shadow-md border border-purple-200">
              <CardHeader className="pb-3 bg-purple-50/50">
                <CardTitle className="text-base sm:text-lg text-purple-800 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">
                      Total Scans
                    </span>
                    <span className="font-bold text-blue-600 text-sm sm:text-base">
                      {historyLoading ? "..." : getStats().totalScans}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">
                      Healthy Plants
                    </span>
                    <span className="font-bold text-green-600 text-sm sm:text-base">
                      {historyLoading ? "..." : `${getStats().successRate}%`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium">
                      Diseases Found
                    </span>
                    <span className="font-bold text-red-600 text-sm sm:text-base">
                      {historyLoading ? "..." : getStats().diseasedCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                    <span className="text-amber-700 font-medium">
                      This Week
                    </span>
                    <span className="font-bold text-amber-600 text-sm sm:text-base">
                      {historyLoading
                        ? "..."
                        : Math.max(0, getStats().totalScans - 10)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
