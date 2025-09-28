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
  PhoneCall,
  Languages,
  CloudSun,
  IndianRupee,
  Sprout,
  Bot,
  Scan as ScanIcon,
  Mic,
  Mic2,
  Volume2,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Award,
  Target,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Info,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  Globe,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  X,
  Menu,
  Home,
  User,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  Download,
  Upload,
  Share,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  RefreshCw,
  Loader,
  Loader2,
  Check,
  XCircle,
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
import ElevenLabsConvai from "./ElevenLabsConvai";
import ChatBot from "./chat/ChatBot";
import ElevenLabsWidget from "@/components/ElevenLabsWidget";

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] text-gray-800">
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header / Branding */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-[#2F855A] text-white flex items-center justify-center shadow-lg">
                <Sprout className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2F855A]">
                  AgriLenses
                </h1>
                <p className="text-sm sm:text-lg text-[#2F855A]/80 font-medium">
                  Smart Multilingual AI Crop Advisor
                </p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Helping 86% of India's small & marginal farmers with instant
              advice in their own language.
            </p>
          </div>
        </div>

        {/* Hero Impact Section */}
        <div className="mb-8 sm:mb-12">
          <Card className="rounded-2xl border border-[#2F855A]/20 bg-white/95 backdrop-blur shadow-xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2F855A] mb-2">
                  What Farmers Get in 30 Seconds
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Instant AI-powered farming assistance at your fingertips
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#2F855A]/10">
                  <div className="p-2 bg-[#2F855A] rounded-lg text-white">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2F855A] text-sm">
                      Voice Commands
                    </p>
                    <p className="text-xs text-gray-600">
                      Ask in Hindi, Tamil, or English
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#2F855A]/10">
                  <div className="p-2 bg-[#2F855A] rounded-lg text-white">
                    <ScanIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2F855A] text-sm">
                      Instant Disease Scan
                    </p>
                    <p className="text-xs text-gray-600">
                      AI detects crop problems
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#2F855A]/10">
                  <div className="p-2 bg-[#2F855A] rounded-lg text-white">
                    <CloudSun className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2F855A] text-sm">
                      Real-time Weather
                    </p>
                    <p className="text-xs text-gray-600">
                      Village-specific forecasts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#FAF9F6] rounded-xl border border-[#2F855A]/10">
                  <div className="p-2 bg-[#2F855A] rounded-lg text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2F855A] text-sm">
                      Market Prices
                    </p>
                    <p className="text-xs text-gray-600">Today's mandi rates</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/dashboard/scanner">
                  <Button
                    size="lg"
                    className="bg-[#2F855A] hover:bg-[#2F855A]/90 text-white font-bold px-8 py-3 text-lg shadow-lg"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Stats - Farmer Benefits */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2F855A] mb-2">
              Real Farmer Impact
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Measurable benefits delivered to farmers across India
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#2F855A]/5 to-[#2F855A]/10 border-[#2F855A]/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-[#2F855A] rounded-full text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#2F855A] mb-1">
                12
              </div>
              <p className="text-sm font-medium text-gray-700">Crops Saved</p>
              <p className="text-xs text-gray-600">This week</p>
            </Card>

            <Card className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#E53E3E]/5 to-[#E53E3E]/10 border-[#E53E3E]/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-[#E53E3E] rounded-full text-white">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#E53E3E] mb-1">
                7
              </div>
              <p className="text-sm font-medium text-gray-700">
                Diseases Detected
              </p>
              <p className="text-xs text-gray-600">Early prevention</p>
            </Card>

            <Card className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#F6AD55]/5 to-[#F6AD55]/10 border-[#F6AD55]/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-[#F6AD55] rounded-full text-white">
                  <Droplets className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#F6AD55] mb-1">
                120L
              </div>
              <p className="text-sm font-medium text-gray-700">Water Saved</p>
              <p className="text-xs text-gray-600">Per farmer</p>
            </Card>

            <Card className="text-center p-4 sm:p-6 bg-gradient-to-br from-[#2F855A]/5 to-[#2F855A]/10 border-[#2F855A]/20">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-[#2F855A] rounded-full text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#2F855A] mb-1">
                +25%
              </div>
              <p className="text-sm font-medium text-gray-700">
                Yield Potential
              </p>
              <p className="text-xs text-gray-600">Increase achieved</p>
            </Card>
          </div>
        </div>

        {/* AI Advisor Section - Enhanced */}
        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2F855A] mb-2">
              AI Farming Assistant
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Get instant expert advice on crop diseases, weather, farming
              techniques, and more in your preferred language
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Chat Interface */}
            <div className="xl:col-span-2">
              <Card className="rounded-2xl border border-[#2F855A]/20 bg-white/95 backdrop-blur shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#2F855A] to-[#2F855A]/80 text-white pb-0">
                  <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
                    <MessageCircle className="h-6 w-6" />
                    Chat with AgriLens AI
                  </CardTitle>
                  <CardDescription className="text-[#2F855A]/20 text-sm sm:text-base">
                    Ask questions in English, Hindi, or Tamil • Voice & text
                    support
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatBot heightValue="h-[500px] sm:h-[550px]" />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Support */}
            <div className="space-y-4 sm:space-y-6">
              {/* Voice Call Support */}
              <Card className="rounded-2xl border border-[#2F855A]/20 bg-gradient-to-br from-[#FAF9F6] to-[#2F855A]/5 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#2F855A]">
                    <Mic className="h-5 w-5 text-[#2F855A]" />
                    Voice Support
                  </CardTitle>
                  <CardDescription className="text-[#2F855A]/80">
                    Instant voice assistance in multiple languages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600 bg-white/70 p-3 rounded-lg">
                    Tap the call button and speak naturally. Our AI understands
                    Hindi, Tamil, and English.
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl border border-[#2F855A]/20">
                    <ElevenLabsConvai />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="rounded-2xl border border-[#F6AD55]/20 bg-gradient-to-br from-[#F6AD55]/5 to-[#F6AD55]/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#F6AD55]">
                    <Lightbulb className="h-5 w-5 text-[#F6AD55]" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 p-2 bg-white/70 rounded-lg">
                      <Camera className="h-4 w-4 text-[#F6AD55] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Upload clear, well-lit plant photos for better disease
                        detection
                      </span>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/70 rounded-lg">
                      <CloudSun className="h-4 w-4 text-[#F6AD55] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Check weather forecasts before applying pesticides
                      </span>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/70 rounded-lg">
                      <Phone className="h-4 w-4 text-[#F6AD55] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Use voice commands for hands-free farming assistance
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Support */}
              <Card className="rounded-2xl border border-[#2F855A]/20 bg-gradient-to-br from-[#2F855A]/5 to-[#2F855A]/10 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2 text-[#2F855A]">
                    <Languages className="h-5 w-5 text-[#2F855A]" />
                    Multi-Language
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <Globe className="h-5 w-5 mx-auto mb-1 text-[#2F855A]" />
                      <div className="text-xs font-medium text-gray-700">
                        English
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <Globe className="h-5 w-5 mx-auto mb-1 text-[#2F855A]" />
                      <div className="text-xs font-medium text-gray-700">
                        हिंदी
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/70 rounded-lg">
                      <Globe className="h-5 w-5 mx-auto mb-1 text-[#2F855A]" />
                      <div className="text-xs font-medium text-gray-700">
                        தமிழ்
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* === LEFT COLUMN === */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Priority 1: Quick Stats Overview - Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-emerald-50/40">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Total
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
                    {historyLoading ? "..." : getStats().totalScans}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-green-500 bg-green-50/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Healthy
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-green-700 mt-1">
                    {historyLoading ? "..." : getStats().healthyCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-red-500 bg-red-50/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Diseased
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-red-700 mt-1">
                    {historyLoading ? "..." : getStats().diseasedCount}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-l-4 border-l-purple-500 bg-purple-50/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Success
                    </p>
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold text-purple-700 mt-1">
                    {historyLoading ? "..." : `${getStats().successRate}%`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Priority 2: Analytics & Charts Section - Detailed Analysis */}
            <div className="space-y-4 sm:space-y-6">
              {/* Analytics Header */}
              <div className="flex items-center gap-2 border-l-4 border-l-emerald-500 pl-3">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-700" />
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Insights
                </h2>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Line Chart - Tomato & Potato Disease Detection */}
                <Card className="shadow-sm rounded-2xl border border-emerald-100 p-0 max-h-[420px] flex flex-col bg-white/90 backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      Disease Trends (7d)
                    </CardTitle>
                    <CardDescription>Tomato vs Potato</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-4 flex-1">
                    {historyLoading ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <div className="text-gray-500 text-sm sm:text-base">
                          Loading chart...
                        </div>
                      </div>
                    ) : lineChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <div className="text-center text-gray-500">
                          <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="h-7 w-7 text-gray-400" />
                          </div>
                          <div className="font-medium">No data available</div>
                          <div className="text-xs sm:text-sm">
                            Start scanning plants to see trends
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart
                            data={lineChartData}
                            margin={{
                              top: 20,
                              right: 20,
                              left: 10,
                              bottom: 30,
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
                              axisLine={{ stroke: "#d1d5db" }}
                              tickLine={{ stroke: "#d1d5db" }}
                              tickMargin={10}
                              height={50}
                            />

                            <YAxis
                              stroke="#6b7280"
                              fontSize={12}
                              domain={[0, "dataMax + 1"]}
                              allowDecimals={false}
                              tick={{ fill: "#6b7280" }}
                              axisLine={{ stroke: "#d1d5db" }}
                              tickLine={{ stroke: "#d1d5db" }}
                              tickMargin={10}
                              width={60}
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
                            />

                            <Tooltip
                              formatter={(value, name) => [
                                `${value} diseased plants`,
                                name === "tomato" ? "Tomato" : "Potato",
                              ]}
                              labelFormatter={(label) => `${label}`}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                padding: "10px 14px",
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
                                paddingTop: "10px",
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
                                stroke: "#fff",
                                strokeWidth: 2,
                                r: 4,
                              }}
                              activeDot={{
                                r: 6,
                                stroke: "#ef4444",
                                strokeWidth: 2,
                                fill: "#fff",
                              }}
                              name="Tomato Diseases"
                              connectNulls
                            />

                            <Line
                              type="monotone"
                              dataKey="potato"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{
                                fill: "#f59e0b",
                                stroke: "#fff",
                                strokeWidth: 2,
                                r: 4,
                              }}
                              activeDot={{
                                r: 6,
                                stroke: "#f59e0b",
                                strokeWidth: 2,
                                fill: "#fff",
                              }}
                              name="Potato Diseases"
                              connectNulls
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Enhanced Bar Chart */}
                <Card className="shadow-sm max-h-[420px] flex flex-col border border-emerald-100 bg-white/90 backdrop-blur rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Health Mix
                    </CardTitle>
                    <CardDescription>Healthy vs Diseased</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {historyLoading ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <div className="text-gray-500">Loading chart...</div>
                      </div>
                    ) : barChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-[200px]">
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
                      <div className="w-full h-[220px] overflow-hidden">
                        <ResponsiveContainer width="100%" height={220}>
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
                                  ? "Healthy"
                                  : "Diseased",
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
              <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-lg border border-emerald-500/50">
                <div className="flex items-start gap-4">
                  <div className="bg-white/15 p-3 rounded-full shadow-lg">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Start Scan</h2>
                    <p className="text-emerald-100 mt-1 font-medium text-sm">
                      Instant AI-powered disease detection and get treatment
                      recommendations immediately
                    </p>
                  </div>
                </div>
                <Link href={"/dashboard/scanner"} className="cursor-pointer">
                  <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg mt-4 py-5 text-md flex justify-between items-center cursor-pointer shadow-md">
                    Scanning Now
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>

              {/* NEW: AI Chat Assistant Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg border border-blue-500/50">
                <div className="flex items-start gap-4">
                  <div className="bg-white/15 p-3 rounded-full shadow-lg">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Advisor</h2>
                    <p className="text-indigo-100 mt-1 font-medium text-sm">
                      Get instant expert farming advice in English, Hindi, or
                      Tamil with voice support
                    </p>
                  </div>
                </div>
                <Link href={"/dashboard/chat"} className="cursor-pointer">
                  <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-lg mt-4 py-5 text-md flex justify-between items-center cursor-pointer shadow-md">
                    Start Chat Now
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Priority 3: Select Your Crop Card - Essential for Scanning */}
            <Card className="shadow-sm border border-emerald-200 rounded-2xl">
              <CardHeader className="bg-emerald-50/60">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-emerald-800">
                    Select Your Crop
                  </CardTitle>
                </div>
                <CardDescription className="text-emerald-700">
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
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredCrops.map((crop) => (
                    <button
                      key={crop.name}
                      onClick={() => handleCropSelection(crop)}
                      className={`cursor-pointer group p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        crop.isAval
                          ? "hover:border-emerald-500 hover:bg-emerald-50 border-emerald-200 hover:shadow-md"
                          : "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                      }`}
                      disabled={!crop.isAval}
                    >
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-3xl sm:text-4xl mb-2">
                          {crop.emoji}
                        </div>
                      </div>
                      <h3
                        className={`font-bold text-sm sm:text-base ${
                          crop.isAval ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {crop.name}
                      </h3>
                      <p
                        className={`text-xs font-medium ${
                          crop.isAval ? "text-emerald-600" : "text-gray-400"
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
            <Card className="shadow-md border-0 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-2xl border-b border-indigo-100">
                <CardTitle className="text-lg flex items-center gap-2 font-bold text-gray-900">
                  <div className="h-3 w-3 bg-indigo-500 rounded-full animate-ping"></div>
                  📊 Recent Scans
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Track your latest crop health results
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                {historyLoading ? (
                  <div className="flex flex-col items-center justify-center h-36 text-gray-500 gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
                    <p>Loading activity...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300/60 scrollbar-track-transparent">
                    {scanHistory.slice(0, 5).map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                      >
                        {/* Status Icon */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className={`w-3.5 h-3.5 rounded-full shadow ${
                              scan.isHealthy ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {scan.crop}
                            </p>
                            <p
                              className={`text-sm ${
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
                        </div>

                        {/* Confidence + Date */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {Math.round(scan.confidence * 100)}%
                          </p>
                          <div className="mt-1 w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                scan.isHealthy ? "bg-green-500" : "bg-red-500"
                              }`}
                              style={{
                                width: `${Math.round(scan.confidence * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            {scan.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Empty state */}
                    {scanHistory.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                        <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          🔍
                        </div>
                        <p className="font-medium">No recent scans</p>
                        <p className="text-sm">
                          Start scanning to see activity here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* === RIGHT COLUMN === */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Weather Section - Action-Oriented */}
            <Card className="shadow-lg border border-[#2F855A]/20 rounded-2xl bg-white/95 backdrop-blur">
              <CardHeader className="pb-2 bg-[#2F855A]/5 border-b border-[#2F855A]/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-lg text-[#2F855A] font-bold">
                      Live Weather
                    </CardTitle>
                  </div>
                  <div className="text-xs text-[#2F855A]/80 font-medium">
                    {weatherData?.current?.last_updated || "Live"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Main Temperature Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#2F855A]/10 rounded-full flex items-center justify-center shadow-inner">
                      <CloudSun className="h-7 w-7 sm:h-9 sm:w-9 text-[#2F855A]" />
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-[#2F855A]">
                        {weatherData?.current?.temp_c ||
                          mockWeather.temperature}
                        °C
                      </div>
                      <p className="text-sm text-gray-600">
                        {weatherData?.current?.condition?.text || "Mist"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="text-center py-2 bg-[#FAF9F6] rounded-lg">
                  <MapPin className="h-4 w-4 mx-auto mb-1 text-[#2F855A]" />
                  <p className="font-semibold text-[#2F855A] text-sm sm:text-base">
                    {weatherData?.location?.name || "Chennai"},{" "}
                    {weatherData?.location?.region || "Tamil Nadu"}
                  </p>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-[#FAF9F6] rounded-lg p-3">
                    <Droplets className="h-4 w-4 text-[#2F855A]" />
                    <div>
                      <p className="text-gray-600 text-xs">Humidity</p>
                      <p className="font-bold text-[#2F855A]">
                        {weatherData?.current?.humidity || "84"}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#FAF9F6] rounded-lg p-3">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Wind</p>
                      <p className="font-bold text-[#2F855A]">
                        {weatherData?.current?.wind_kph || "18.7"} kph
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actionable Farming Advice */}
                <div className="bg-[#F6AD55]/10 border border-[#F6AD55]/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#F6AD55] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#F6AD55] text-sm mb-1">
                        Farming Advisory
                      </p>
                      <p className="text-sm text-gray-700">
                        Rain expected tomorrow — avoid spraying pesticides today
                        to prevent runoff and protect your crops.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Farmer's Toolbox */}
            <Card className="shadow-lg border border-[#2F855A]/20 rounded-2xl bg-white/95 backdrop-blur">
              <CardHeader className="bg-[#2F855A]/5 border-b border-[#2F855A]/10">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 font-bold text-[#2F855A]">
                  <Target className="h-5 w-5" />
                  Farmer's Toolbox
                </CardTitle>
                <CardDescription className="text-[#2F855A]/80">
                  Essential tools for modern farming
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Government Schemes */}
                  <Link href="/dashboard/schemes">
                    <Button
                      variant="outline"
                      className="w-full p-3 sm:p-4 bg-gradient-to-r from-[#2F855A]/5 to-[#2F855A]/10 border-[#2F855A]/20 hover:border-[#2F855A]/40 hover:shadow-md transition-all rounded-xl overflow-hidden h-auto"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="p-2 sm:p-3 bg-[#2F855A] rounded-lg flex-shrink-0">
                          <Building2 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="font-bold text-[#2F855A] text-sm sm:text-base">
                            Government Schemes
                          </h4>
                          <p className="text-sm sm:text-sm text-[#2F855A]/80">
                            insurance, subsidies
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#2F855A]/60 flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>

                  {/* Market Prices */}
                  <Link href="/dashboard/market">
                    <Button
                      variant="outline"
                      className="w-full p-3 sm:p-4 bg-gradient-to-r from-[#F6AD55]/5 to-[#F6AD55]/10 border-[#F6AD55]/20 hover:border-[#F6AD55]/40 hover:shadow-md transition-all rounded-xl overflow-hidden h-auto"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="p-2 sm:p-3 bg-[#F6AD55] rounded-lg flex-shrink-0">
                          <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="font-bold text-[#F6AD55] text-sm sm:text-base">
                            Market Prices
                          </h4>
                          <p className="text-sm sm:text-sm text-[#F6AD55]/80">
                            Today's mandi rates
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#F6AD55]/60 flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>

                  {/* Weather Forecast */}
                  <Link href="/dashboard/weather">
                    <Button
                      variant="outline"
                      className="w-full p-3 sm:p-4 bg-gradient-to-r from-[#2F855A]/5 to-[#2F855A]/10 border-[#2F855A]/20 hover:border-[#2F855A]/40 hover:shadow-md transition-all rounded-xl overflow-hidden h-auto"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="p-2 sm:p-3 bg-[#2F855A] rounded-lg flex-shrink-0">
                          <CloudSun className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="font-bold text-[#2F855A] text-sm sm:text-base">
                            Weather Forecast
                          </h4>
                          <p className="text-sm sm:text-sm text-[#2F855A]/80">
                            5-day predictions
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#2F855A]/60 flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>

                  {/* Disease Scan */}
                  <Link href="/dashboard/scanner">
                    <Button
                      variant="outline"
                      className="w-full p-3 sm:p-4 bg-gradient-to-r from-[#E53E3E]/5 to-[#E53E3E]/10 border-[#E53E3E]/20 hover:border-[#E53E3E]/40 hover:shadow-md transition-all rounded-xl overflow-hidden h-auto"
                    >
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="p-2 sm:p-3 bg-[#E53E3E] rounded-lg flex-shrink-0">
                          <ScanIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h4 className="font-bold text-[#E53E3E] text-sm sm:text-base">
                            Disease Scan
                          </h4>
                          <p className="text-sm sm:text-sm text-[#E53E3E]/80">
                            Instant suggestions
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#E53E3E]/60 flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Priority 4: Quick Action Stats - Live Data */}
            <Card className="shadow-sm border border-purple-200 rounded-2xl">
              <CardHeader className="pb-3 bg-purple-50/60">
                <CardTitle className="text-base sm:text-lg text-purple-800 flex items-center gap-2 font-extrabold">
                  <Activity className="h-4 w-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
                    <span className="text-blue-700 font-medium">
                      Total Scans
                    </span>
                    <span className="font-extrabold text-blue-700 text-sm sm:text-base">
                      {historyLoading ? "..." : getStats().totalScans}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
                    <span className="text-green-700 font-medium">
                      Healthy Plants
                    </span>
                    <span className="font-extrabold text-green-700 text-sm sm:text-base">
                      {historyLoading ? "..." : `${getStats().successRate}%`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-xl">
                    <span className="text-red-700 font-medium">
                      Diseases Found
                    </span>
                    <span className="font-extrabold text-red-700 text-sm sm:text-base">
                      {historyLoading ? "..." : getStats().diseasedCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded-xl">
                    <span className="text-amber-700 font-medium">
                      This Week
                    </span>
                    <span className="font-extrabold text-amber-700 text-sm sm:text-base">
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
        {/* ElevenLabs Convai Widget - Hidden on chat page */}
        <ElevenLabsWidget />
      </main>
    </div>
  );
}
