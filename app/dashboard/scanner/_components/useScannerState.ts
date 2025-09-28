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

    // Validate API URL is available
    if (!url || url === 'undefined') {
      throw new Error(`Prediction API URL not configured for ${selectedCrop.name}`);
    }

    // Optimized base64 to File conversion
    const base64Data = capturedImage.split(',')[1];
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const file = new File([bytes], "image.jpg", { type: "image/jpeg" });

    // Prepare the image as FormData
    const formData = new FormData();
    formData.append("file", file);

    // Run prediction and image upload in parallel for better performance
    let predictionResponse;
    let imageResponse;

    try {
      console.log("Starting parallel API calls...");
      console.log("Prediction URL:", url);
      
      [predictionResponse, imageResponse] = await Promise.all([
        axios.post(url, formData, { 
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }).catch((error: any) => {
          console.error("Prediction API error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
          });
          throw new Error(`Prediction API failed (${error.response?.status || 'unknown'}): ${error.response?.data?.message || error.message || 'Unknown error'}`);
        }),
        (async () => {
          try {
            console.log("Starting image upload...");
            const uploadFormData = new FormData();
            uploadFormData.append("image", file);
            uploadFormData.append("folder", `plant-disease/${selectedCrop.name}`);
            const result = await axios.post("/api/upload-image", uploadFormData, { 
              timeout: 30000,
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            });
            console.log("Image upload successful");
            return result;
          } catch (uploadError: any) {
            console.error("Image upload error details:", {
              status: uploadError.response?.status,
              statusText: uploadError.response?.statusText,
              data: uploadError.response?.data,
              message: uploadError.message
            });
            throw new Error(`Image upload failed (${uploadError.response?.status || 'unknown'}): ${uploadError.response?.data?.error || uploadError.message || 'Unknown error'}`);
          }
        })()
      ]);
      
      console.log("Both API calls completed successfully");
    } catch (parallelError: any) {
      console.error("Parallel API call error:", parallelError);
      throw new Error(`API call failed: ${parallelError.message || 'Unknown error'}`);
    }

    // Handle image upload response
    if (imageResponse.status !== 200) {
      throw new Error("Failed to upload image");
    }

    // Generate suggestion and store in database in parallel
    const [suggestionResponse, storeResponse] = await Promise.all([
      (async () => {
        try {
          console.log("Generating suggestion...");
          const response = await axios.post("/api/generate-suggestion", {
            plantName: selectedCrop.name,
            disease: predictionResponse.data.prediction || null,
            confidence: predictionResponse.data.confidence || 0,
          });
          console.log("Suggestion generated successfully");
          return response;
        } catch (suggestionError: any) {
          console.error("Suggestion generation error:", {
            status: suggestionError.response?.status,
            statusText: suggestionError.response?.statusText,
            data: suggestionError.response?.data,
            message: suggestionError.message
          });
          // Return a fallback suggestion
          return {
            data: {
              suggestion: {
                identification: {
                  diseaseName: predictionResponse.data.prediction || "Unknown",
                  plant: selectedCrop.name,
                  confidence: Math.round((predictionResponse.data.confidence || 0) * 100),
                  symptoms: ["Please consult a local agricultural expert for specific symptoms"]
                },
                managementPlan: {
                  culturalAndPreventative: [
                    "Remove affected plant parts",
                    "Improve air circulation",
                    "Avoid overhead watering"
                  ],
                  treatments: {
                    organicOptions: [{
                      activeIngredient: "Neem Oil",
                      description: "Natural fungicide",
                      application: "Mix 2-3 ml per liter and spray weekly"
                    }],
                    chemicalOptions: [{
                      activeIngredient: "Copper fungicide",
                      description: "Effective against fungal diseases",
                      application: "Apply according to instructions"
                    }]
                  }
                },
                longTermCare: {
                  notes: [
                    "Monitor plant health regularly",
                    "Practice crop rotation",
                    "Maintain proper soil health"
                  ]
                },
                warning: "This is a general suggestion. Consult local experts for specific advice."
              }
            }
          };
        }
      })(),
      (async () => {
        try {
          console.log("Storing scan in database...");
          const response = await axios.post("/api/store-scan", {
            plantName: selectedCrop.name,
            disease: predictionResponse.data.prediction || null,
            confidence: predictionResponse.data.confidence || 0,
            imageUrl: imageResponse.data.secure_url,
            suggestion: null, // Will be updated after generation
          });
          console.log("Scan stored successfully");
          return response;
        } catch (dbError: any) {
          console.error("Database storage error:", {
            status: dbError.response?.status,
            statusText: dbError.response?.statusText,
            data: dbError.response?.data,
            message: dbError.message
          });
          return null; // Continue without storing in DB
        }
      })()
    ]);

    // Prepare the analysis result data
    const resultData: AnalysisData = {
      crop: selectedCrop.name,
      image: imageResponse.data.secure_url,
      disease: predictionResponse.data.prediction || null,
      confidence: predictionResponse.data.confidence || 0,
      isHealthy: predictionResponse.data.prediction === "healthy" ? true : false || false,
      suggestion: suggestionResponse.data.suggestion || "",
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
