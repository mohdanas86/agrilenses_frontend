import { useState, useEffect } from 'react';
import { ScanRecord, FilterStatus, SortBy, HistoryStats } from './types';
import { mockScanHistory } from './mock-data';

export function useHistoryState() {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, this would fetch from an API
    setScanHistory(mockScanHistory);
  }, []);

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
    filteredAndSortedHistory,
    getTimeDifference,
    getStats,
    exportHistory,
  };
}
