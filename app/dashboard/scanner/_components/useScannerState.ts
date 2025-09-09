"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CropModel, ScanResult, AnalysisData } from "./types";
import { useGlobalContext } from "@/context/GlobalContext";
import { useUser } from "@clerk/nextjs";
import apiService from "@/lib/api-service";

export function useScannerState() {
  const router = useRouter();
  const { user } = useUser();
  const { selectedCrop, setSelectedCrop } = useGlobalContext();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleImageSelect = useCallback((image: string) => {
    setCapturedImage(image);
    setError(null);
  }, []);

  const handleRetakePhoto = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    setScanResult(null);
  }, []);

  const handleCropSelect = useCallback((crop: CropModel) => {
    setSelectedCrop(crop);
  }, [setSelectedCrop]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleViewHistory = useCallback(() => {
    router.push("/dashboard/history");
  }, [router]);

  const handleViewResults = useCallback(() => {
    router.push("/dashboard/results");
  }, [router]);

  // Enhanced analyze function using API service
  const analyzeImage = useCallback(async () => {
    if (!capturedImage || !user?.id) {
      setError("Please capture an image and ensure you're logged in");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Convert base64 image to file with proper validation
      console.log('Converting captured image to file...');
      
      let blob: Blob;
      let fileName: string;
      
      if (capturedImage.startsWith('data:')) {
        // Handle data URL format
        const response = await fetch(capturedImage);
        blob = await response.blob();
        fileName = `scan-${Date.now()}.jpg`;
      } else {
        // Handle regular URL format
        const response = await fetch(capturedImage);
        blob = await response.blob();
        fileName = `scan-${Date.now()}.jpg`;
      }

      // Ensure the blob is a valid image
      if (!blob.type.startsWith('image/')) {
        throw new Error('Invalid image format');
      }

      const file = new File([blob], fileName, { 
        type: blob.type || 'image/jpeg',
        lastModified: Date.now()
      });

      console.log('File created:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Get user location (you might want to implement geolocation)
      const userLocation = 'Delhi'; // Default location

      // Perform complete scan workflow using API service
      const result = await apiService.performScan(
        selectedCrop.id as 'potato' | 'tomato',
        file,
        user.id,
        userLocation
      );

      // Format the result for the UI
      const scanResult: ScanResult = {
        id: result.scanRecord.id || `scan-${Date.now()}`,
        disease: result.prediction.prediction,
        confidence: result.prediction.confidence,
        severity: result.prediction.severity || 'Medium',
        recommendations: result.prediction.recommendations || [],
        analysis: {
          timestamp: new Date().toISOString(),
          imageUrl: capturedImage,
          cropType: selectedCrop.name,
          location: userLocation,
          weather: result.weather,
          environmentalFactors: {
            temperature: result.weather?.temperature || 0,
            humidity: result.weather?.humidity || 0,
            conditions: result.weather?.conditions || 'Unknown'
          }
        }
      };

      setScanResult(scanResult);
      
      // Store in session storage for results page
      sessionStorage.setItem('latestScanResult', JSON.stringify(scanResult));
      
      // Navigate to results
      router.push('/dashboard/results');

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  }, [capturedImage, user?.id, selectedCrop, router]);

  // Submit feedback for a scan
  const submitFeedback = useCallback(async (scanId: string, rating: number, comments?: string) => {
    if (!user?.id) return;

    try {
      await apiService.submitFeedback({
        scan_id: scanId,
        prediction_id: scanId,
        user_id: user.id,
        feedback_type: 'rating',
        rating,
        comments
      });
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  }, [user?.id]);

  // Legacy support for old component structure
  const handleAnalyzeCrop = analyzeImage;

  return {
    // State
    selectedCrop,
    capturedImage,
    analyzing,
    error,
    scanResult,
    
    // Actions
    handleImageSelect,
    handleRetakePhoto,
    handleCropSelect,
    handleBack,
    handleViewHistory,
    handleViewResults,
    analyzeImage,
    handleAnalyzeCrop, // Legacy support
    submitFeedback,
    
    // Utils
    userId: user?.id || null,
    isLoggedIn: !!user?.id
  };
}
