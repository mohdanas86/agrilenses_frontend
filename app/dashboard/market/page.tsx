"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  RefreshCw,
  Filter,
  BarChart3,
  IndianRupee,
  Truck,
  Scale,
  Clock,
  AlertTriangle,
  CheckCircle,
  Store,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Mock data for market prices
interface MarketPrice {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  state: string;
  district: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  priceChange: number;
  priceChangePercent: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  category:
    | "cereals"
    | "pulses"
    | "vegetables"
    | "fruits"
    | "spices"
    | "oilseeds";
  quality: "FAQ" | "Grade A" | "Grade B" | "Organic";
  availability: "high" | "medium" | "low";
  demandLevel: "high" | "medium" | "low";
  weatherImpact: "positive" | "negative" | "neutral";
  icon: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

const mockMarketPrices: MarketPrice[] = [
  {
    id: "1",
    commodity: "Wheat",
    variety: "Sharbati",
    market: "Azadpur Mandi",
    state: "Delhi",
    district: "New Delhi",
    currentPrice: 2450,
    previousPrice: 2380,
    unit: "per quintal",
    priceChange: 70,
    priceChangePercent: 2.94,
    trend: "up",
    lastUpdated: "2024-12-25 09:30 AM",
    minPrice: 2350,
    maxPrice: 2500,
    avgPrice: 2425,
    category: "cereals",
    quality: "FAQ",
    availability: "high",
    demandLevel: "medium",
    weatherImpact: "positive",
    icon: "🌾",
  },
  {
    id: "2",
    commodity: "Rice",
    variety: "Basmati",
    market: "Karnal Mandi",
    state: "Haryana",
    district: "Karnal",
    currentPrice: 4250,
    previousPrice: 4180,
    unit: "per quintal",
    priceChange: 70,
    priceChangePercent: 1.67,
    trend: "up",
    lastUpdated: "2024-12-25 10:15 AM",
    minPrice: 4100,
    maxPrice: 4350,
    avgPrice: 4225,
    category: "cereals",
    quality: "Grade A",
    availability: "medium",
    demandLevel: "high",
    weatherImpact: "neutral",
    icon: "🍚",
  },
  {
    id: "3",
    commodity: "Tomato",
    variety: "Hybrid",
    market: "Koyambedu Market",
    state: "Tamil Nadu",
    district: "Chennai",
    currentPrice: 850,
    previousPrice: 920,
    unit: "per quintal",
    priceChange: -70,
    priceChangePercent: -7.61,
    trend: "down",
    lastUpdated: "2024-12-25 08:45 AM",
    minPrice: 800,
    maxPrice: 950,
    avgPrice: 875,
    category: "vegetables",
    quality: "Grade A",
    availability: "high",
    demandLevel: "medium",
    weatherImpact: "positive",
    icon: "🍅",
  },
  {
    id: "4",
    commodity: "Onion",
    variety: "Red",
    market: "Lasalgaon Market",
    state: "Maharashtra",
    district: "Nashik",
    currentPrice: 1850,
    previousPrice: 1850,
    unit: "per quintal",
    priceChange: 0,
    priceChangePercent: 0,
    trend: "stable",
    lastUpdated: "2024-12-25 11:00 AM",
    minPrice: 1750,
    maxPrice: 1950,
    avgPrice: 1850,
    category: "vegetables",
    quality: "FAQ",
    availability: "medium",
    demandLevel: "high",
    weatherImpact: "neutral",
    icon: "🧅",
  },
  {
    id: "5",
    commodity: "Potato",
    variety: "Jyoti",
    market: "Agra Mandi",
    state: "Uttar Pradesh",
    district: "Agra",
    currentPrice: 1250,
    previousPrice: 1320,
    unit: "per quintal",
    priceChange: -70,
    priceChangePercent: -5.3,
    trend: "down",
    lastUpdated: "2024-12-25 09:20 AM",
    minPrice: 1200,
    maxPrice: 1350,
    avgPrice: 1275,
    category: "vegetables",
    quality: "Grade B",
    availability: "high",
    demandLevel: "low",
    weatherImpact: "positive",
    icon: "🥔",
  },
  {
    id: "6",
    commodity: "Mustard",
    variety: "Varuna",
    market: "Jaipur Mandi",
    state: "Rajasthan",
    district: "Jaipur",
    currentPrice: 5650,
    previousPrice: 5580,
    unit: "per quintal",
    priceChange: 70,
    priceChangePercent: 1.25,
    trend: "up",
    lastUpdated: "2024-12-25 10:30 AM",
    minPrice: 5500,
    maxPrice: 5750,
    avgPrice: 5625,
    category: "oilseeds",
    quality: "FAQ",
    availability: "medium",
    demandLevel: "high",
    weatherImpact: "negative",
    icon: "🌻",
  },
  {
    id: "7",
    commodity: "Turmeric",
    variety: "Finger",
    market: "Erode Market",
    state: "Tamil Nadu",
    district: "Erode",
    currentPrice: 12500,
    previousPrice: 12200,
    unit: "per quintal",
    priceChange: 300,
    priceChangePercent: 2.46,
    trend: "up",
    lastUpdated: "2024-12-25 09:45 AM",
    minPrice: 12000,
    maxPrice: 13000,
    avgPrice: 12500,
    category: "spices",
    quality: "Grade A",
    availability: "low",
    demandLevel: "high",
    weatherImpact: "negative",
    icon: "🌶️",
  },
  {
    id: "8",
    commodity: "Apple",
    variety: "Royal Delicious",
    market: "Shimla Market",
    state: "Himachal Pradesh",
    district: "Shimla",
    currentPrice: 4500,
    previousPrice: 4300,
    unit: "per quintal",
    priceChange: 200,
    priceChangePercent: 4.65,
    trend: "up",
    lastUpdated: "2024-12-25 08:30 AM",
    minPrice: 4200,
    maxPrice: 4800,
    avgPrice: 4500,
    category: "fruits",
    quality: "Grade A",
    availability: "medium",
    demandLevel: "high",
    weatherImpact: "positive",
    icon: "🍎",
  },
];

// Generate mock price history data
const generatePriceHistory = (currentPrice: number): PriceHistory[] => {
  const history: PriceHistory[] = [];
  const days = 30;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Generate deterministic price variation based on date to avoid hydration issues
    const seed = date.getTime() / (1000 * 60 * 60 * 24); // Day-based seed
    const variation = Math.sin(seed) * 0.05; // ±5% variation, deterministic
    const price = Math.round(currentPrice + currentPrice * variation);

    history.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: Math.max(price, currentPrice * 0.8), // Ensure price doesn't go too low
    });
  }

  return history;
};

const categories = [
  { id: "all", name: "All", icon: "📊" },
  { id: "cereals", name: "Cereals", icon: "🌾" },
  { id: "pulses", name: "Pulses", icon: "🫘" },
  { id: "vegetables", name: "Vegetables", icon: "🥬" },
  { id: "fruits", name: "Fruits", icon: "🍎" },
  { id: "spices", name: "Spices", icon: "🌶️" },
  { id: "oilseeds", name: "Oilseeds", icon: "🌻" },
];

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>(mockMarketPrices);
  const [filteredPrices, setFilteredPrices] =
    useState<MarketPrice[]>(mockMarketPrices);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<MarketPrice | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price" | "change">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter and sort prices
  useEffect(() => {
    let filtered = prices;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (price) => price.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort prices
    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.commodity.localeCompare(b.commodity);
          break;
        case "price":
          comparison = a.currentPrice - b.currentPrice;
          break;
        case "change":
          comparison = a.priceChangePercent - b.priceChangePercent;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPrices(filtered);
  }, [prices, selectedCategory, searchTerm, sortBy, sortOrder]);

  const refreshPrices = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch fresh data from API
    console.log("Refreshing market prices...");
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-purple-100 text-purple-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedPrice) {
    const priceHistory = generatePriceHistory(selectedPrice.currentPrice);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedPrice(null)}
              className="h-10 w-10 p-0"
            >
              ←
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">{selectedPrice.icon}</span>
                {selectedPrice.commodity} - {selectedPrice.variety}
              </h1>
              <p className="text-gray-600">
                {selectedPrice.market}, {selectedPrice.district}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Price Overview */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Current Market Price</CardTitle>
                <CardDescription>Live pricing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Current Price</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{selectedPrice.currentPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPrice.unit}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold">Price Change</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${getTrendColor(
                        selectedPrice.trend
                      )}`}
                    >
                      {getTrendIcon(selectedPrice.trend)}
                      <span className="text-lg font-bold">
                        {selectedPrice.priceChange > 0 ? "+" : ""}₹
                        {selectedPrice.priceChange}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedPrice.priceChangePercent > 0 ? "+" : ""}
                      {selectedPrice.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Min - Max</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      ₹{selectedPrice.minPrice} - ₹{selectedPrice.maxPrice}
                    </p>
                    <p className="text-sm text-gray-600">Today's range</p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold">Last Updated</span>
                    </div>
                    <p className="text-sm font-bold text-orange-600">
                      {selectedPrice.lastUpdated}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>30-Day Price Trend</CardTitle>
                <CardDescription>Historical price movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tick={{ fill: "#6b7280" }}
                        domain={["dataMin - 100", "dataMax + 100"]}
                      />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, "Price"]}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        activeDot={{
                          r: 6,
                          stroke: "#3b82f6",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-600" />
                    Market Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market:</span>
                      <span className="font-semibold">
                        {selectedPrice.market}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-semibold">
                        {selectedPrice.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">District:</span>
                      <span className="font-semibold">
                        {selectedPrice.district}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality:</span>
                      <Badge variant="outline">{selectedPrice.quality}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">
                        {selectedPrice.category.charAt(0).toUpperCase() +
                          selectedPrice.category.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Market Dynamics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Availability:</span>
                      <Badge
                        className={getAvailabilityColor(
                          selectedPrice.availability
                        )}
                      >
                        {selectedPrice.availability.charAt(0).toUpperCase() +
                          selectedPrice.availability.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Demand Level:</span>
                      <Badge
                        className={getDemandColor(selectedPrice.demandLevel)}
                      >
                        {selectedPrice.demandLevel.charAt(0).toUpperCase() +
                          selectedPrice.demandLevel.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weather Impact:</span>
                      <div className="flex items-center gap-1">
                        {selectedPrice.weatherImpact === "positive" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : selectedPrice.weatherImpact === "negative" ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                        <span
                          className={
                            selectedPrice.weatherImpact === "positive"
                              ? "text-green-600"
                              : selectedPrice.weatherImpact === "negative"
                              ? "text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {selectedPrice.weatherImpact.charAt(0).toUpperCase() +
                            selectedPrice.weatherImpact.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Price:</span>
                      <span className="font-semibold">
                        ₹{selectedPrice.avgPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Market Prices
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time agricultural commodity prices from major markets across
            India
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search commodities, markets, or states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={refreshPrices}
              className="flex items-center gap-2 h-12"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "name") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("name");
                  setSortOrder("asc");
                }
              }}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "price") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("price");
                  setSortOrder("desc");
                }
              }}
            >
              Price {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
            <Button
              variant={sortBy === "change" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (sortBy === "change") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("change");
                  setSortOrder("desc");
                }
              }}
            >
              Change {sortBy === "change" && (sortOrder === "asc" ? "↑" : "↓")}
            </Button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredPrices.length} price
            {filteredPrices.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {mounted ? lastRefresh.toLocaleTimeString() : "--:--:--"}
          </p>
        </div>

        {/* Prices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrices.map((price) => (
            <Card
              key={price.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPrice(price)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{price.icon}</div>
                    <div>
                      <CardTitle className="text-lg">
                        {price.commodity}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {price.variety} • {price.quality}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(price.trend)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Current Price
                      </span>
                      <span className="text-xl font-bold text-blue-600">
                        ₹{price.currentPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Change</span>
                      <div
                        className={`flex items-center gap-1 ${getTrendColor(
                          price.trend
                        )}`}
                      >
                        <span className="font-semibold">
                          {price.priceChange > 0 ? "+" : ""}₹{price.priceChange}
                        </span>
                        <span className="text-sm">
                          ({price.priceChangePercent > 0 ? "+" : ""}
                          {price.priceChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{price.unit}</p>
                  </div>

                  {/* Market Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{price.market}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {price.district}, {price.state}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={getAvailabilityColor(price.availability)}
                      variant="secondary"
                    >
                      {price.availability} supply
                    </Badge>
                    <Badge
                      className={getDemandColor(price.demandLevel)}
                      variant="secondary"
                    >
                      {price.demandLevel} demand
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500">
                    Updated: {price.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No prices found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
