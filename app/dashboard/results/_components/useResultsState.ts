import { useState, useEffect } from 'react';
import { ScanResult } from './types';

export function useResultsState() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedResult = localStorage.getItem('scanResult');
    if (storedResult) {
      setScanResult(JSON.parse(storedResult));
    }
  }, []);

  const handleShare = async () => {
    if (!scanResult) return;
    
    const shareData = {
      title: `Agri-Lens - ${scanResult.crop} Scan Result`,
      text: `${scanResult.isHealthy ? 'Healthy' : scanResult.disease} detected with ${scanResult.confidence}% confidence`,
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
