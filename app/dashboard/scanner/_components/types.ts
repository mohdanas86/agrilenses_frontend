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
  disease: string | null;
  confidence: number;
  isHealthy: boolean;
}

export interface AnalysisData {
  crop: string;
  image: string;
  disease: string | null;
  confidence: number;
  isHealthy: boolean;
  timestamp: string;
  suggestion?: []
}
