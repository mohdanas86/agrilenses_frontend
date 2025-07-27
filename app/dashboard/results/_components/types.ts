export interface TreatmentOption {
  activeIngredient: string;
  application: string;
  description: string;
}

export interface Treatments {
  chemicalOptions?: TreatmentOption[];
  organicOptions?: TreatmentOption[];
  warning?: string;
}

export interface ManagementPlan {
  culturalAndPreventative?: string[];
  treatments?: Treatments;
}

export interface LongTermCare {
  notes?: string[];
}

export interface Identification {
  diseaseName: string;
  plant: string;
  confidence: number;
  symptoms?: string[];
}

export interface Suggestion {
  identification?: Identification;
  longTermCare?: LongTermCare;
  managementPlan?: ManagementPlan;
}

export interface ScanResult {
  crop: string;
  disease: string | null;
  confidence: number;
  isHealthy: boolean;
  image: string;
  timestamp: string;
  suggestion?: Suggestion;
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
