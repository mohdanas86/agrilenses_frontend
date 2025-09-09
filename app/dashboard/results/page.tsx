"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  History,
  ImagePlus,
  Share2,
  Leaf,
  Activity,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Download,
  Maximize2,
  ShieldCheck,
  Sprout,
  FlaskConical,
  Clock,
  Eye,
  TrendingUp,
  Award,
  ArrowLeft,
  Star,
  ThermometerSun,
  Droplets,
  Wind,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import { ScanResult } from "../scanner/_components/types";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  type = "neutral",
  showProgress,
}: {
  icon: any;
  label: string;
  value: string;
  type?: "neutral" | "success" | "warning" | "error";
  showProgress?: number;
}) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          border: "border-green-200",
          bg: "bg-green-50",
          icon: "text-green-600",
          text: "text-green-900",
        };
      case "warning":
        return {
          border: "border-amber-200",
          bg: "bg-amber-50",
          icon: "text-amber-600",
          text: "text-amber-900",
        };
      case "error":
        return {
          border: "border-red-200",
          bg: "bg-red-50",
          icon: "text-red-600",
          text: "text-red-900",
        };
      default:
        return {
          border: "border-gray-200",
          bg: "bg-gray-50",
          icon: "text-gray-600",
          text: "text-gray-900",
        };
    }
  };

  const styles = getStyles();

  return (
    <Card
      className={`border ${styles.border} shadow-sm bg-white hover:shadow-md transition-shadow duration-200`}
    >
      <CardContent className="p-4">
        <div className={`p-2 ${styles.bg} rounded-lg mb-3 w-fit`}>
          <Icon className={`h-5 w-5 ${styles.icon}`} />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-lg font-bold ${styles.text}`}>{value}</p>

          {showProgress && (
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gray-600 transition-all duration-500"
                  style={{ width: `${showProgress}%` }}
                >
                </div>
              </div>
              <p className="text-xs text-gray-500">Confidence Level</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ResultPage() {
  const [scanData, setScanData] = useState<ScanResult | null>(null);

  useEffect(() => {
    // Try to get scan result from session storage
    const storedResult = sessionStorage.getItem('latestScanResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setScanData(result);
      } catch (error) {
        console.error('Failed to parse scan result:', error);
      }
    }
  }, []);

  if (!scanData) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <FlaskConical className="h-16 w-16 text-gray-400 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">No Scan Results Available</h2>
                <p className="text-gray-600">
                  Please perform a scan first to see the results here.
                </p>
                <Link href="/dashboard/scanner">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Start New Scan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getConfidenceType = (confidence: number) => {
    if (confidence >= 90) return "success";
    if (confidence >= 70) return "warning";
    return "error";
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Activity className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Plant Analysis Results
                    </h1>
                    <p className="text-gray-600">
                      AI-powered disease detection and management
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        scanData.disease === null || scanData.disease === "Healthy" 
                          ? "bg-green-500" 
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {scanData.disease === null || scanData.disease === "Healthy"
                        ? "Healthy Plant"
                        : "Disease Detected"}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm text-gray-500">
                    {scanData.analysis?.timestamp ? 
                      formatDate(scanData.analysis.timestamp) : 
                      'Just now'
                    }
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BackButton title="" />
                <Link href="/dashboard/history">
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </Link>
                <Link href="/dashboard/scanner">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                icon={Target}
                label="Detection Accuracy"
                value={`${Math.round(scanData.confidence * 100)}%`}
                type={getConfidenceType(scanData.confidence * 100)}
                showProgress={scanData.confidence * 100}
              />
              <MetricCard
                icon={Leaf}
                label="Crop Type"
                value={scanData.analysis?.cropType || "Unknown"}
                type="neutral"
              />
              <MetricCard
                icon={Activity}
                label="Health Status"
                value={scanData.disease === null || scanData.disease === "Healthy" ? "Healthy" : "Disease Found"}
                type={scanData.disease === null || scanData.disease === "Healthy" ? "success" : "error"}
              />
            </div>

            {/* Disease Information */}
            {scanData.disease && scanData.disease !== "Healthy" && (
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span>Disease Identification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scanData.disease.replace(/_/g, " ").replace("___", " - ")}
                    </h3>
                    {scanData.severity && (
                      <Badge className={getSeverityColor(scanData.severity)}>
                        {scanData.severity} Severity
                      </Badge>
                    )}
                  </div>

                  {scanData.recommendations && scanData.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {scanData.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Weather Context */}
            {scanData.analysis?.weather && (
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ThermometerSun className="h-5 w-5 text-blue-600" />
                    <span>Environmental Context</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <ThermometerSun className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Temperature</p>
                        <p className="text-lg font-bold text-gray-900">
                          {scanData.analysis?.environmentalFactors?.temperature || 
                           scanData.analysis?.weather?.temperature || 'N/A'}°C
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Humidity</p>
                        <p className="text-lg font-bold text-gray-900">
                          {scanData.analysis?.environmentalFactors?.humidity || 
                           scanData.analysis?.weather?.humidity || 'N/A'}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-lg font-bold text-gray-900">
                          {scanData.analysis?.location || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="space-y-8">
            {/* Analyzed Image */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <span>Analyzed Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src={scanData.analysis?.imageUrl || "/placeholder-plant.jpg"}
                    alt="Analyzed plant"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur-sm">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Scan ID:</span>
                    <span className="text-sm text-gray-900 font-mono">
                      {scanData.id.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Analysis Time:</span>
                    <span className="text-sm text-gray-900">
                      {scanData.analysis?.timestamp ? 
                        new Date(scanData.analysis.timestamp).toLocaleTimeString() : 
                        'Just now'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Link href="/dashboard/scanner" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Scan Another Plant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
