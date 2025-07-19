import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { FilterStatus, SortBy, ScanRecord } from "./types";

interface FilterSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  filterCrop: string;
  setFilterCrop: (crop: string) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  scanHistory: ScanRecord[];
}

export function FilterSearch({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCrop,
  setFilterCrop,
  sortBy,
  setSortBy,
  scanHistory,
}: FilterSearchProps) {
  const getUniqueCrops = () => {
    return [...new Set(scanHistory.map((record) => record.crop))].sort();
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Filter & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search crops or diseases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy Only</option>
            <option value="diseased">Diseased Only</option>
          </select>

          {/* Crop Filter */}
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Crops</option>
            {getUniqueCrops().map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="confidence">Sort by Confidence</option>
            <option value="crop">Sort by Crop</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
