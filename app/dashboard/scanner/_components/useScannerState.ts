"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CropModel, ScanResult, AnalysisData } from "./types";
import { cropModels } from "./crop-models";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from 'axios'

export function useScannerState() {
  const router = useRouter();
  const { selectedCrop, setSelectedCrop, userId } = useGlobalContext();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // ======================================
  
  // console.log("Current selected crop:", selectedCrop.name.toLowerCase());  
  // console.log("Captured image:", capturedImage);
  // console.log("userId:", userId);


  // ========================================================
  //=== call model according to selected crop ===
 const handleAnalyzeCrop = async () => {
  setAnalyzing(true);
  setError(null);

  // validate user ID
  if (userId === undefined || userId === null) {
    throw new Error("User ID is not defined.");
  }

  try {
    let url = "";

    // Check if a crop is selected
    if (!selectedCrop || !selectedCrop.id) {
      throw new Error("No crop selected for analysis.");
    }

    // Check if an image is captured
    if (!capturedImage) {
      throw new Error("No image captured for analysis.");
    }

    // Call the appropriate model based on the selected crop
    if (selectedCrop.name.toLowerCase() === "tomato") {
      url = `${process.env.TOMATO_PREDICTION_API_URL || process.env.NEXT_PUBLIC_TOMATO_PREDICTION_API_URL}`;
    }
    if (selectedCrop.name.toLowerCase() === "potato") {
      url = `${process.env.POTATO_PREDICTION_API_URL || process.env.NEXT_PUBLIC_POTATO_PREDICTION_API_URL}`;
    }

    // Convert base64 to File object
    const base64Response = await fetch(capturedImage);
    const blob = await base64Response.blob();
    const file = new File([blob], "image.jpg", { type: "image/jpeg" });

    // Prepare the image as FormData
    const formData = new FormData();
    formData.append("file", file);

    // predict disease using the selected crop model
    const predictionResponse = await axios.post(url, formData);
    // 🚫 Removed manual headers

    // console.log("Prediction response:", predictionResponse.data); // confidence, crop, prediction

    // Upload image to Cloudinary via API route
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);
    uploadFormData.append("folder", `plant-disease/${selectedCrop.name}`);

    const imageResponse = await axios.post("/api/upload-image", uploadFormData);

    // Handle image upload response
    if (imageResponse.status !== 200) {
      throw new Error("Failed to upload image");
    }

    // generate the suggestion (with error handling)
 
      const suggestion = await axios.post("/api/generate-suggestion", {
        plantName: selectedCrop.name,
        disease: predictionResponse.data.prediction || null,
        confidence: predictionResponse.data.confidence || 0,
      });

    // console.log("Suggestion response:", suggestion.data.suggestion);

    // store data in database (with error handling)
    let storedSuccessfully = false;
    try {
      const analysisData = await axios.post("/api/store-scan", {
        plantName: selectedCrop.name,
        disease: predictionResponse.data.prediction || null,
        confidence: predictionResponse.data.confidence || 0,
        imageUrl: imageResponse.data.secure_url,
        suggestion: suggestion.data.suggestion || null,
      });
      // console.log("Analysis data stored:", analysisData.data);
      storedSuccessfully = true;
    } catch (dbError) {
      console.error("Database storage error:", dbError);
      // Continue without storing in DB - still show results to user
    }

    // Prepare the analysis result data
    const resultData: AnalysisData = {
      crop: selectedCrop.name,
      image: imageResponse.data.secure_url,
      disease: predictionResponse.data.prediction || null,
      confidence: predictionResponse.data.confidence || 0,
      isHealthy: predictionResponse.data.prediction === "healthy" ? true : false || false,
      suggestion: suggestion.data.suggestion || "",
      timestamp: new Date().toISOString(),
    };

    // Save the analysis result in local storage
    localStorage.setItem("scanResult", JSON.stringify(resultData));

    // Navigate to results page with the analysis result
    router.push("/dashboard/results");

  } catch (err) {
    setError("Analysis failed. Please try again.");
    console.error("Error predicting disease:", err);
    return null;
  } finally {
    setAnalyzing(false);
  }
};

  // ======================================


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
