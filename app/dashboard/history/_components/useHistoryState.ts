import { useState, useEffect, useRef } from 'react';
import { ScanRecord, FilterStatus, SortBy, HistoryStats } from './types';
import { getStoredHistory, storeHistory, generateDemoHistory } from '@/lib/offline-history';

export function useHistoryState() {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false); // Prevent multiple API calls
  const lastFetchTime = useRef<number>(0); // Track last fetch time
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    setIsClient(true);
    
    // Immediately load stored history for instant display
    const storedHistory = getStoredHistory();
    if (storedHistory.length > 0) {
      console.log('Loaded stored history:', storedHistory.length, 'records');
      setScanHistory(storedHistory);
      setIsLoading(false);
    } else {
      // If no stored history, show demo data immediately
      console.log('No stored history, showing demo data');
      setScanHistory(generateDemoHistory());
      setIsLoading(false);
    }
    
    // Then try to fetch fresh data in background (only if not fetched recently)
    const now = Date.now();
    const shouldFetch = !hasFetched.current || (now - lastFetchTime.current > CACHE_DURATION);
    
    if (shouldFetch) {
      fetchScanHistoryInBackground();
      hasFetched.current = true;
      lastFetchTime.current = now;
    }
  }, []);

  // Background fetch without loading state
  const fetchScanHistoryInBackground = async () => {
    try {
      console.log('Background fetch: Attempting to fetch scan history...');
      const response = await fetch('/api/history');
      
      console.log('Background fetch: Response status:', response.status);
      
      const data = await response.json();
      console.log('Background fetch: Response data:', data);

      if (response.ok && data.success && data.scanHistory && data.scanHistory.length > 0) {
        // Transform and store fresh data
        const transformedHistory: ScanRecord[] = data.scanHistory.map((scan: any) => ({
          id: scan.id,
          crop: scan.crop,
          disease: scan.disease,
          confidence: scan.confidence < 1 ? scan.confidence : scan.confidence / 100,
          timestamp: new Date(scan.timestamp),
          image: scan.image,
          isHealthy: scan.isHealthy,
          location: undefined,
          suggestion: scan.suggestion
        }));

        // Store in localStorage for future use
        storeHistory(transformedHistory);
        setScanHistory(transformedHistory);
        console.log(`Background fetch: Successfully loaded ${transformedHistory.length} scan records`);
      } else {
        console.log('Background fetch: No fresh data available, keeping existing data');
      }
    } catch (error) {
      console.log('Background fetch failed, keeping existing data:', error);
      // Don't show error or change loading state - just keep existing data
    }
  };

  const fetchScanHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting to fetch scan history...');
      const response = await fetch('/api/history');
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error('Please sign in to view your scan history');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.error || `HTTP ${response.status}: Failed to fetch scan history`);
        }
      }

      if (data.success && data.scanHistory && data.scanHistory.length > 0) {
        // Transform the data to match the frontend interface
        const transformedHistory: ScanRecord[] = data.scanHistory.map((scan: any) => ({
          id: scan.id,
          crop: scan.crop,
          disease: scan.disease,
          confidence: scan.confidence < 1 ? scan.confidence : scan.confidence / 100, // Normalize confidence to 0-1 range
          timestamp: new Date(scan.timestamp),
          image: scan.image,
          isHealthy: scan.isHealthy,
          location: undefined, // Optional field
          suggestion: scan.suggestion
        }));

        setScanHistory(transformedHistory);
        console.log(`Successfully loaded ${transformedHistory.length} scan records`);
      } else if (data.success) {
        // API returned success but no data - use demo data
        console.log('API returned no scan history, using demo data');
        if (data.message) {
          console.log('API message:', data.message);
        }
        const demoData = generateDemoHistory();
        setScanHistory(demoData);
        storeHistory(demoData);
      } else {
        // Use demo data for demo/prototype
        console.log('API returned unsuccessful response, using demo data');
        const demoData = generateDemoHistory();
        setScanHistory(demoData);
        storeHistory(demoData);
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
      
      let errorMessage = 'Failed to load scan history';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      // Only set error for user auth issues, otherwise silently use placeholder data
      if (errorMessage.includes('sign in') || errorMessage.includes('Unauthorized')) {
        setError(errorMessage);
      } else {
        // For other errors, don't show error state, just use placeholder data
        console.log('Using placeholder data due to service error:', errorMessage);
      }
      
      console.log('Using demo data due to error');
      // Use demo data as fallback
      const demoData = generateDemoHistory();
      setScanHistory(demoData);
      storeHistory(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedHistory = scanHistory
    .filter(record => {
      const matchesSearch = record.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (record.disease && record.disease.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'healthy' && record.isHealthy) ||
                           (filterStatus === 'diseased' && !record.isHealthy);
      const matchesCrop = filterCrop === 'all' || record.crop === filterCrop;

      return matchesSearch && matchesStatus && matchesCrop;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'confidence':
          return b.confidence - a.confidence;
        case 'crop':
          return a.crop.localeCompare(b.crop);
        default:
          return 0;
      }
    });

  const getTimeDifference = (date: Date) => {
    if (!isClient) return '';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getStats = (): HistoryStats => {
    const healthyCount = scanHistory.filter(record => record.isHealthy).length;
    const diseasedCount = scanHistory.filter(record => !record.isHealthy).length;
    const successRate = scanHistory.length > 0 ? Math.round((healthyCount / scanHistory.length) * 100) : 0;

    return {
      totalScans: scanHistory.length,
      healthyCount,
      diseasedCount,
      successRate,
    };
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(scanHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'agri-lens-history.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const forceRefresh = () => {
    hasFetched.current = false;
    lastFetchTime.current = 0;
    fetchScanHistory();
  };

  return {
    scanHistory,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCrop,
    setFilterCrop,
    sortBy,
    setSortBy,
    isClient,
    isLoading,
    error,
    filteredAndSortedHistory,
    getTimeDifference,
    getStats,
    exportHistory,
    refetch: fetchScanHistory,
    forceRefresh,
  };
}
