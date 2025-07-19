"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CropModel, ScanResult, AnalysisData } from "./types";
import { cropModels } from "./crop-models";

export function useScannerState() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropModel>(cropModels[0]);

  const handleImageSelect = useCallback((image: string) => {
    setCapturedImage(image);
    setError(null);
  }, []);

  const handleRetakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  const handleCropSelect = useCallback((crop: CropModel) => {
    setSelectedCrop(crop);
  }, []);

  const handleAnalyzeCrop = useCallback(async () => {
    if (!capturedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockResults: ScanResult[] = [
        { disease: null, confidence: 96, isHealthy: true },
        { disease: "Late Blight", confidence: 94, isHealthy: false },
        { disease: "Early Blight", confidence: 87, isHealthy: false },
        { disease: "Bacterial Spot", confidence: 92, isHealthy: false },
      ];

      const result = mockResults[Math.floor(Math.random() * mockResults.length)];

      // Navigate to results page with the analysis result
      const resultData: AnalysisData = {
        crop: selectedCrop.name,
        image: capturedImage,
        ...result,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("scanResult", JSON.stringify(resultData));
      router.push("/results");
    } catch (err) {
      setError("Analysis failed. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  }, [capturedImage, selectedCrop, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleViewHistory = useCallback(() => {
    router.push("/dashboard/history");
  }, [router]);

  const handleViewResults = useCallback(() => {
    router.push("/dashboard/results");
  }, [router]);

  return {
    // State
    capturedImage,
    analyzing,
    error,
    selectedCrop,
    
    // Handlers
    handleImageSelect,
    handleRetakePhoto,
    handleCropSelect,
    handleAnalyzeCrop,
    handleBack,
    handleViewHistory,
    handleViewResults,
  };
}
