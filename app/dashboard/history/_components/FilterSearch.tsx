import { memo, useMemo, useCallback } from "react";
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

export const FilterSearch = memo(
  ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCrop,
    setFilterCrop,
    sortBy,
    setSortBy,
    scanHistory,
  }: FilterSearchProps) => {
    const uniqueCrops = useMemo(() => {
      return [...new Set(scanHistory.map((record) => record.crop))].sort();
    }, [scanHistory]);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      [setSearchTerm]
    );

    const handleStatusChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value as FilterStatus);
      },
      [setFilterStatus]
    );

    const handleCropChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterCrop(e.target.value);
      },
      [setFilterCrop]
    );

    const handleSortChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortBy);
      },
      [setSortBy]
    );

    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-base sm:text-lg font-semibold text-gray-900">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops or diseases..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 text-sm h-9 focus:ring-2 focus:ring-green-500 border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={handleStatusChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-9 hover:border-gray-400 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="healthy">Healthy Only</option>
              <option value="diseased">Diseased Only</option>
            </select>

            {/* Crop Filter */}
            <select
              value={filterCrop}
              onChange={handleCropChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-9 hover:border-gray-400 transition-colors"
            >
              <option value="all">All Crops</option>
              {uniqueCrops.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white h-9 hover:border-gray-400 transition-colors"
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
);

FilterSearch.displayName = "FilterSearch";
