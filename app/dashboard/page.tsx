"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  TrendingUp, 
  CloudRain, 
  Activity, 
  Scan,
  AlertTriangle,
  DollarSign,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  ArrowRight,
  FileText,
  Shield
} from "lucide-react";
import Link from "next/link";
import apiService from "@/lib/api-service";

// Dashboard Data Types
interface DashboardData {
  health?: any;
  recentScans?: any;
  weather?: any;
  marketPrices?: any;
  analytics?: any;
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
}

const Dashboard = () => {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('Delhi'); // Default location

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user location (in real app, use geolocation API)
      const userLocation = location || 'Delhi';
      
      const data = await apiService.getDashboardData(user?.id || 'demo-user', userLocation);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Generate quick stats from dashboard data
  const getQuickStats = (): QuickStat[] => {
    const { recentScans, analytics, weather } = dashboardData;
    
    return [
      {
        title: "Total Scans",
        value: recentScans?.total || "0",
        change: "+12%",
        trend: 'up',
        icon: Scan
      },
      {
        title: "Healthy Plants",
        value: `${analytics?.healthy_percentage || 0}%`,
        change: "+5%",
        trend: 'up',
        icon: Leaf
      },
      {
        title: "Today's Temp",
        value: `${weather?.temperature || '--'}°C`,
        change: weather?.temperature_trend || "stable",
        trend: 'neutral',
        icon: Thermometer
      },
      {
        title: "Market Alert",
        value: "Good",
        change: "Prices stable",
        trend: 'neutral',
        icon: DollarSign
      }
    ];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadDashboardData} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickStats = getQuickStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName || 'Farmer'}! Here's your farm overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scanner">
            <Button className="bg-green-600 hover:bg-green-700">
              <Scan className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </Link>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Weather Conditions
            </CardTitle>
            <CardDescription>Current weather in {location}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.weather ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-semibold">{dashboardData.weather.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Humidity</span>
                  </div>
                  <span className="font-semibold">{dashboardData.weather.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>Conditions</span>
                  </div>
                  <Badge variant="outline">{dashboardData.weather.conditions}</Badge>
                </div>
                <Link href="/dashboard/weather">
                  <Button variant="outline" className="w-full mt-4">
                    View Full Forecast
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-gray-500">Weather data loading...</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Disease Scans
            </CardTitle>
            <CardDescription>Latest plant health analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentScans?.scans?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentScans.scans.slice(0, 4).map((scan: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Leaf className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{scan.crop_type} - {scan.prediction}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(scan.scan_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={scan.confidence > 80 ? "default" : "secondary"}
                      className={scan.confidence > 80 ? "bg-green-100 text-green-800" : ""}
                    >
                      {scan.confidence}% confidence
                    </Badge>
                  </div>
                ))}
                <Link href="/dashboard/history">
                  <Button variant="outline" className="w-full">
                    View All Scans
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Scan className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No scans yet</p>
                <Link href="/dashboard/scanner">
                  <Button>Start Your First Scan</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Prices & Government Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Prices
            </CardTitle>
            <CardDescription>Today's commodity prices</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.marketPrices?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.marketPrices.slice(0, 3).map((price: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{price.commodity}</p>
                      <p className="text-sm text-gray-600">{price.market}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{price.price}/{price.unit}</p>
                      <p className="text-sm text-green-600">+2.5%</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Prices
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">Market data loading...</p>
            )}
          </CardContent>
        </Card>

        {/* Government Schemes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Government Schemes
            </CardTitle>
            <CardDescription>Available support programs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">PMFBY Crop Insurance</h4>
              <p className="text-sm text-blue-700">Protect your crops with government insurance</p>
              <Button variant="outline" size="sm" className="mt-2">
                Apply Now
              </Button>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Soil Health Card</h4>
              <p className="text-sm text-green-700">Get soil analysis and recommendations</p>
              <Button variant="outline" size="sm" className="mt-2">
                Check Status
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              View All Schemes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for better farm management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/scanner">
              <Button variant="outline" className="h-20 flex flex-col">
                <Scan className="h-6 w-6 mb-2" />
                Disease Scan
              </Button>
            </Link>
            <Link href="/dashboard/weather">
              <Button variant="outline" className="h-20 flex flex-col">
                <CloudRain className="h-6 w-6 mb-2" />
                Weather Forecast
              </Button>
            </Link>
            <Link href="/dashboard/market">
              <Button variant="outline" className="h-20 flex flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                Market Prices
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button variant="outline" className="h-20 flex flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Generate Report
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
