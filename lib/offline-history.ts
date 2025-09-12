// Offline-first history management
import { ScanRecord } from '@/app/dashboard/history/_components/types';

const STORAGE_KEY = 'agrilens_scan_history';
const MAX_CACHE_AGE = 1000 * 60 * 30; // 30 minutes

export interface StoredScanRecord {
  id: string;
  crop: string;
  disease: string | null;
  confidence: number;
  timestamp: string; // ISO string
  image: string;
  isHealthy: boolean;
  suggestion?: string;
  location?: string;
}

// Get stored scan history from localStorage
export function getStoredHistory(): ScanRecord[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    
    // Check if data is expired
    if (Date.now() - data.timestamp > MAX_CACHE_AGE) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    
    // Convert stored records back to ScanRecord format
    return data.records.map((record: StoredScanRecord) => ({
      ...record,
      timestamp: new Date(record.timestamp)
    }));
  } catch (error) {
    console.error('Error reading stored history:', error);
    return [];
  }
}

// Store scan history to localStorage
export function storeHistory(records: ScanRecord[]): void {
  try {
    if (typeof window === 'undefined') return;
    
    const storedRecords: StoredScanRecord[] = records.map(record => ({
      ...record,
      timestamp: record.timestamp.toISOString()
    }));
    
    const data = {
      timestamp: Date.now(),
      records: storedRecords
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing history:', error);
  }
}

// Add a new scan record
export function addScanRecord(record: ScanRecord): void {
  const existing = getStoredHistory();
  const updated = [record, ...existing].slice(0, 100); // Keep only last 100 records
  storeHistory(updated);
}

// Generate placeholder data for demo
export function generateDemoHistory(): ScanRecord[] {
  const crops = ['Tomato', 'Potato'];
  const diseases = ['Late Blight', 'Early Blight', 'Bacterial Spot', null];
  const placeholderData: ScanRecord[] = [];

  // Generate data for the last 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate 1-2 scans per day
    const scansPerDay = Math.floor(Math.random() * 2) + 1;
    
    for (let j = 0; j < scansPerDay; j++) {
      const crop = crops[Math.floor(Math.random() * crops.length)];
      const diseaseRandom = diseases[Math.floor(Math.random() * diseases.length)];
      const isHealthy = diseaseRandom === null;
      
      placeholderData.push({
        id: `demo-${i}-${j}`,
        crop,
        disease: diseaseRandom,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        timestamp: new Date(date.getTime() + j * 3600000), // Spread throughout the day
        image: `/vegicons/${crop.toLowerCase()}.png`,
        isHealthy,
        location: 'Demo Location',
        suggestion: isHealthy 
          ? 'Plant looks healthy! Continue current care routine.' 
          : `Treatment recommended for ${diseaseRandom}. Consult agricultural expert for detailed treatment plan.`
      });
    }
  }

  return placeholderData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
