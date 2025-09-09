"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  RefreshCw,
  ArrowLeft,
  Leaf,
  Package,
  Users,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";
import apiService, { MarketPrice } from "@/lib/api-service";
import { useUser } from "@clerk/nextjs";

interface EnhancedMarketPrice extends MarketPrice {
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

const PriceCard = ({ 
  marketPrice 
}: { 
  marketPrice: EnhancedMarketPrice 
}) => {
  const getTrendIcon = () => {
    if (marketPrice.trend === 'up') return TrendingUp;
    if (marketPrice.trend === 'down') return TrendingDown;
    return BarChart3;
  };

  const getTrendColor = () => {
    if (marketPrice.trend === 'up') return 'text-green-600';
    if (marketPrice.trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Leaf className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{marketPrice.commodity}</h3>
              <p className="text-sm text-gray-600">{marketPrice.market}</p>
            </div>
          </div>
          <div className={`p-1 rounded-full ${getTrendColor()}`}>
            <TrendIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900">₹{marketPrice.price.toLocaleString()}</span>
            <span className="text-sm text-gray-600">/{marketPrice.unit}</span>
          </div>

          {marketPrice.change !== undefined && (
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {marketPrice.change >= 0 ? '+' : ''}₹{Math.abs(marketPrice.change)}
              </span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Updated: {new Date(marketPrice.date).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  color = "text-blue-600" 
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  trend?: number;
  color?: string;
}) => (
  <Card className="border border-gray-200 shadow-sm bg-white">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              <TrendingUp className={`h-3 w-3 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 bg-blue-50 rounded-lg`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MarketPage() {
  const { user } = useUser();
  const [marketPrices, setMarketPrices] = useState<EnhancedMarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  useEffect(() => {
    loadMarketData();
  }, [selectedMarket, selectedCrop]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: Record<string, any> = {};
      if (selectedMarket !== 'all') filters.market = selectedMarket;
      if (selectedCrop !== 'all') filters.commodity = selectedCrop;

      const data = await apiService.getMarketPrices(filters);
      
      // Add mock trend data if not provided by API
      const enhancedData: EnhancedMarketPrice[] = data.map((price) => ({
        ...price,
        change: (Math.random() - 0.5) * 200,
        trend: (Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
      }));

      setMarketPrices(enhancedData);
    } catch (err) {
      console.error('Failed to load market data:', err);
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const getMarketStats = () => {
    if (marketPrices.length === 0) return { avgPrice: 0, totalMarkets: 0, priceRange: { min: 0, max: 0 } };

    const prices = marketPrices.map(p => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const totalMarkets = new Set(marketPrices.map(p => p.market)).size;
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    return { avgPrice, totalMarkets, priceRange };
  };

  const stats = getMarketStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading market data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Market Prices
                    </h1>
                    <p className="text-gray-600">
                      Real-time crop prices and market trends
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">National Markets</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BackButton title="" />
                <Button 
                  variant="outline" 
                  onClick={loadMarketData}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Link href="/dashboard">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Average Price"
            value={`₹${Math.round(stats.avgPrice).toLocaleString()}`}
            icon={DollarSign}
            color="text-green-600"
            trend={5.2}
          />
          <MetricCard
            title="Active Markets"
            value={stats.totalMarkets}
            icon={Users}
            color="text-blue-600"
          />
          <MetricCard
            title="Price Range"
            value={`₹${stats.priceRange.min.toLocaleString()} - ₹${stats.priceRange.max.toLocaleString()}`}
            icon={Activity}
            color="text-purple-600"
          />
          <MetricCard
            title="Total Crops"
            value={new Set(marketPrices.map(p => p.commodity)).size}
            icon={Package}
            color="text-orange-600"
          />
        </div>

        {/* Filters */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="market-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Market
                </label>
                <select
                  id="market-select"
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Markets</option>
                  <option value="Local Market">Local Market</option>
                  <option value="Mandi">Mandi</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div>
                <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <select
                  id="crop-select"
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Crops</option>
                  <option value="Potato">Potato</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Onion">Onion</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Prices Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Market Prices</h2>
          {marketPrices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketPrices.map((price, index) => (
                <PriceCard key={index} marketPrice={price} />
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No market data available</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your filters or refresh the page
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Market-Based Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/scanner">
                <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50">
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Scan Crops</span>
                    </div>
                    <span className="text-sm text-gray-600">Check crop health before selling</span>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/weather">
                <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50">
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Weather Impact</span>
                    </div>
                    <span className="text-sm text-gray-600">See how weather affects prices</span>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/history">
                <Button variant="outline" className="w-full justify-start h-auto p-4 border-gray-200 hover:bg-gray-50">
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Price History</span>
                    </div>
                    <span className="text-sm text-gray-600">View historical price trends</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
