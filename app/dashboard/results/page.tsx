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
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

// Define types for the scan data
interface TreatmentOption {
  activeIngredient: string;
  description: string;
  application: string;
}

interface ScanData {
  crop: string;
  image: string;
  disease: string;
  confidence: number;
  isHealthy: boolean;
  suggestion: {
    identification: {
      diseaseName: string;
      plant: string;
      confidence: number;
      symptoms: string[];
    };
    managementPlan: {
      culturalAndPreventative: string[];
      treatments: {
        organicOptions: TreatmentOption[];
        chemicalOptions: TreatmentOption[];
      };
    };
    longTermCare: {
      notes: string[];
    };
    warning: string;
  };
  timestamp: string;
}

// Sample data structure - replace with actual localStorage data
const sampleData: ScanData = {
  crop: "Potato",
  image:
    "https://res.cloudinary.com/dxjiwyxqb/image/upload/v1753595467/plant-disease/Potato/h4th0nanau0uj48fpdmg.jpg",
  disease: "Potato___Late_blight",
  confidence: 0.9991913437843323,
  isHealthy: false,
  suggestion: {
    identification: {
      diseaseName: "Potato___Late_blight",
      plant: "Potato",
      confidence: 100,
      symptoms: [
        "Water-soaked, dark spots on leaves",
        "White, cottony growth on leaf undersides",
        "Lesions on stems and petioles",
      ],
    },
    managementPlan: {
      culturalAndPreventative: [
        "Immediately remove and destroy infected plant material",
        "Avoid overhead watering to reduce humidity",
        "Ensure good air circulation around plants",
      ],
      treatments: {
        organicOptions: [
          {
            activeIngredient: "Copper hydroxide",
            description:
              "Copper hydroxide disrupts fungal cell walls and prevents spore germination",
            application:
              "Apply as a foliar spray according to label instructions",
          },
        ],
        chemicalOptions: [
          {
            activeIngredient: "Mefenoxam",
            description:
              "Mefenoxam provides preventative and curative control against late blight",
            application:
              "Apply as a foliar spray during early disease development",
          },
          {
            activeIngredient: "Chlorothalonil",
            description:
              "Chlorothalonil is a broad-spectrum fungicide effective against late blight",
            application:
              "Apply as a foliar spray preventatively, rotate with other fungicides",
          },
        ],
      },
    },
    longTermCare: {
      notes: [
        "Practice crop rotation with non-solanaceous crops",
        "Use certified disease-free seed potatoes",
        "Monitor plants regularly for early detection",
      ],
    },
    warning: "Always read and follow product label instructions",
  },
  timestamp: "2025-07-27T05:51:22.151Z",
};

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
                />
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
  const [scanData, setScanData] = useState<ScanData | null>(null);

  useEffect(() => {
    // Get data from localStorage or use sample data
    const storedData = localStorage.getItem("scanResult");
    if (storedData) {
      try {
        setScanData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing stored data:", error);
        setScanData(sampleData);
      }
    } else {
      setScanData(sampleData);
    }
  }, []);

  if (!scanData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  const formatDiseaseName = (disease: string) => {
    return disease.replace(/___/g, " - ").replace(/_/g, " ");
  };

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
                        scanData.isHealthy ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {scanData.isHealthy
                        ? "Healthy Plant"
                        : "Disease Detected"}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm text-gray-500">
                    {formatDate(scanData.timestamp)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BackButton title="" />
                <Link href="/dashboard/history">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </Link>
                <Link href="/dashboard/scanner">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Scan Again
                  </Button>
                </Link>

                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={Leaf}
          label="Crop Type"
          value={scanData.crop}
          type="neutral"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Disease Status"
          value={
            scanData.isHealthy ? "Healthy" : formatDiseaseName(scanData.disease)
          }
          type={scanData.isHealthy ? "success" : "warning"}
        />
        <MetricCard
          icon={Target}
          label="Confidence"
          value={`${formatConfidence(scanData.confidence)}%`}
          showProgress={formatConfidence(scanData.confidence)}
          type="neutral"
        />
        <MetricCard
          icon={Calendar}
          label="Scan Date"
          value={formatDate(scanData.timestamp)}
          type="neutral"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Image */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Analyzed Image
                  </CardTitle>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  HD Quality
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={scanData.image}
                  alt={`${scanData.crop} analysis`}
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>Analysis Complete</span>
                    <span className="opacity-80">Professional Quality</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Symptoms */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-sm bg-white h-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Symptoms Identified
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Key indicators detected by AI analysis
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanData.suggestion?.identification?.symptoms?.map(
                (symptom: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {symptom}
                      </p>
                      <div className="flex items-center mt-1 space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-gray-500">
                          AI Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Management Plan */}
      <Card className="border border-gray-200 shadow-sm bg-white mb-8">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-gray-700" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Treatment & Management Plan
              </CardTitle>
              <p className="text-gray-600">
                Comprehensive approach to disease management
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Immediate Actions */}
          {scanData.suggestion?.managementPlan?.culturalAndPreventative && (
            <div>
              <Card className="border border-amber-200 bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-900">
                      Immediate Actions Required
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {scanData.suggestion.managementPlan.culturalAndPreventative.map(
                      (action: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-amber-100"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 bg-amber-100 border border-amber-200 rounded-md flex items-center justify-center">
                              <span className="text-xs font-bold text-amber-700">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-800 text-sm leading-relaxed">
                            {action}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Treatment Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Organic Options */}
            {scanData.suggestion?.managementPlan?.treatments
              ?.organicOptions && (
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Leaf className="h-5 w-5 text-green-700" />
                    <div>
                      <h4 className="font-semibold text-green-900">
                        Organic Solutions
                      </h4>
                      <p className="text-xs text-green-700">
                        Natural & eco-friendly
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {scanData.suggestion.managementPlan.treatments.organicOptions.map(
                      (treatment: TreatmentOption, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded-lg border border-green-100"
                        >
                          <h5 className="font-medium text-green-900 mb-2">
                            {treatment.activeIngredient}
                          </h5>
                          <p className="text-sm text-gray-700 mb-2">
                            {treatment.description}
                          </p>
                          <div className="p-2 bg-green-50 rounded border-l-2 border-green-300">
                            <p className="text-xs text-green-800">
                              <strong>Application:</strong>{" "}
                              {treatment.application}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chemical Options */}
            {scanData.suggestion?.managementPlan?.treatments
              ?.chemicalOptions && (
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FlaskConical className="h-5 w-5 text-blue-700" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        Chemical Solutions
                      </h4>
                      <p className="text-xs text-blue-700">
                        Fast-acting & effective
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {scanData.suggestion.managementPlan.treatments.chemicalOptions.map(
                      (treatment: TreatmentOption, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded-lg border border-blue-100"
                        >
                          <h5 className="font-medium text-blue-900 mb-2">
                            {treatment.activeIngredient}
                          </h5>
                          <p className="text-sm text-gray-700 mb-2">
                            {treatment.description}
                          </p>
                          <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-300">
                            <p className="text-xs text-blue-800">
                              <strong>Application:</strong>{" "}
                              {treatment.application}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Long-term Care */}
          {scanData.suggestion?.longTermCare?.notes && (
            <Card className="border border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-700" />
                  <h3 className="text-lg font-semibold text-purple-900">
                    Long-Term Prevention
                  </h3>
                </div>

                <div className="space-y-3">
                  {scanData.suggestion.longTermCare.notes.map(
                    (note: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-100"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {note}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      {scanData.suggestion?.warning && (
        <Card className="border border-red-200 bg-red-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Important Safety Notice
                </h3>
                <p className="text-red-800 leading-relaxed">
                  {scanData.suggestion.warning}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Award className="h-4 w-4" />
          <span>Powered by Advanced AI Technology</span>
        </div>
        <p>
          © 2025 AgriLenses. Professional plant disease detection and
          management.
        </p>
      </footer>
    </div>
  );
}
