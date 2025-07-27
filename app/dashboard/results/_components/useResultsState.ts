import { useState, useEffect } from 'react';
import { ScanResult } from './types';

export function useResultsState() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedResult = localStorage.getItem('scanResult');
      if (storedResult) {
        const parsedResult = JSON.parse(storedResult);
        
        // Ensure required fields exist with defaults
        const normalizedResult: ScanResult = {
          crop: parsedResult.crop || 'Unknown',
          disease: parsedResult.disease || null,
          confidence: parsedResult.confidence || 0,
          isHealthy: parsedResult.isHealthy ?? false,
          image: parsedResult.image || '',
          timestamp: parsedResult.timestamp || new Date().toISOString(),
          suggestion: parsedResult.suggestion || undefined,
        };
        
        setScanResult(normalizedResult);
      }
    } catch (error) {
      console.error('Error parsing scanResult from localStorage:', error);
      // Optionally set a default error state or redirect
    }
  }, []);

  const handleShare = async () => {
    if (!scanResult) return;
    
    const confidence = Math.round((scanResult.confidence || 0) * 100);
    const shareData = {
      title: `Agri-Lens - ${scanResult.crop} Scan Result`,
      text: `${scanResult.isHealthy ? 'Healthy' : scanResult.disease} detected with ${confidence}% confidence`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without native sharing
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + ' - ' + shareData.url)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return {
    scanResult,
    isClient,
    handleShare,
  };
}
