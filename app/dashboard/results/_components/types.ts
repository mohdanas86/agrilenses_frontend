export interface ScanResult {
  crop: string;
  disease: string | null;
  confidence: number;
  isHealthy: boolean;
  image: string;
  timestamp: string;
}

export interface DiseaseInfo {
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  organicTreatments: string[];
  chemicalTreatments: string[];
  prevention: string[];
  severity: 'Low' | 'Medium' | 'High';
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  weather: string;
  scanTime: string;
}
