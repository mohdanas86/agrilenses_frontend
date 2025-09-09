export interface CropModel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  accuracy: string;
  diseases: string[];
  disabled?: boolean;
}

export interface ScanResult {
  id: string;
  disease: string | null;
  confidence: number;
  severity?: string;
  isHealthy?: boolean;
  recommendations?: string[];
  analysis?: {
    timestamp: string;
    imageUrl: string;
    cropType: string;
    location: string;
    weather?: any;
    environmentalFactors?: {
      temperature: number;
      humidity: number;
      conditions: string;
    };
  };
}

export interface AnalysisData {
  crop: string;
  image: string;
  disease: string | null;
  confidence: number;
  isHealthy: boolean;
  timestamp: string;
  suggestion?: string[];
}
