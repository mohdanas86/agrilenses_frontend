import { memo, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Activity, Leaf, Calendar } from "lucide-react";
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

    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center text-lg sm:text-xl font-semibold text-gray-900">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-gray-600" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label
              htmlFor="search"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search crops, diseases, or symptoms..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 h-10 sm:h-11 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Health Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                Health Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plants</SelectItem>
                  <SelectItem value="healthy">Healthy Only</SelectItem>
                  <SelectItem value="diseased">Diseased Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Crop Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Leaf className="h-4 w-4 mr-1" />
                Crop Type
              </Label>
              <Select value={filterCrop} onValueChange={setFilterCrop}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {uniqueCrops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest First</SelectItem>
                  <SelectItem value="confidence">Highest Confidence</SelectItem>
                  <SelectItem value="crop">Crop Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

FilterSearch.displayName = "FilterSearch";
