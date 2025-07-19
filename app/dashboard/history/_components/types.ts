export interface ScanRecord {
  id: string;
  crop: string;
  disease: string | null;
  confidence: number;
  timestamp: Date;
  image: string;
  isHealthy: boolean;
  location?: string;
}

export type FilterStatus = 'all' | 'healthy' | 'diseased';
export type SortBy = 'date' | 'confidence' | 'crop';

export interface HistoryStats {
  totalScans: number;
  healthyCount: number;
  diseasedCount: number;
  successRate: number;
}
