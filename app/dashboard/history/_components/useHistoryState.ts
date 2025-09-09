import { useState, useEffect, useRef } from 'react';
import { ScanRecord, FilterStatus, SortBy, HistoryStats } from './types';

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

  useEffect(() => {
    setIsClient(true);
    // Only fetch if we haven't fetched before
    if (!hasFetched.current) {
      fetchScanHistory();
      hasFetched.current = true;
    }
  }, []);

  const fetchScanHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/history');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scan history');
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
      } else {
        // Use placeholder data for demo/prototype
        setScanHistory(generatePlaceholderData());
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
      setError(error instanceof Error ? error.message : 'Failed to load scan history');
      // Use placeholder data as fallback
      setScanHistory(generatePlaceholderData());
    } finally {
      setIsLoading(false);
    }
  };

  // Generate placeholder data for prototype/demo
  const generatePlaceholderData = (): ScanRecord[] => {
    const crops = ['Tomato', 'Potato'];
    const diseases = ['Late Blight', 'Early Blight', 'Bacterial Spot', null]; // null means healthy
    const placeholderData: ScanRecord[] = [];

    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate 2-3 scans per day
      const scansPerDay = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < scansPerDay; j++) {
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const diseaseRandom = diseases[Math.floor(Math.random() * diseases.length)];
        const isHealthy = diseaseRandom === null;
        
        placeholderData.push({
          id: `placeholder-${i}-${j}`,
          crop,
          disease: diseaseRandom,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          timestamp: new Date(date.getTime() + j * 3600000), // Spread throughout the day
          image: `/placeholder-${crop.toLowerCase()}.jpg`,
          isHealthy,
          location: 'Chennai, TN',
          suggestion: isHealthy ? 'Plant looks healthy!' : `Treatment needed for ${diseaseRandom}`
        });
      }
    }

    return placeholderData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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
  };
}
