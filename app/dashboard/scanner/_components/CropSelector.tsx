"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Leaf } from "lucide-react";
import { CropModel } from "./types";
import { cropModels } from "./crop-models";

interface CropSelectorProps {
  selectedCrop: CropModel;
  onCropSelect: (crop: CropModel) => void;
}

export function CropSelector({
  selectedCrop,
  onCropSelect,
}: CropSelectorProps) {
  const [cropSearchTerm, setCropSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter crops based on search term
  const filteredCrops = cropModels.filter((crop) =>
    crop.name.toLowerCase().includes(cropSearchTerm.toLowerCase())
  );

  const handleCropSelect = (crop: CropModel) => {
    if (crop.disabled) return;
    onCropSelect(crop);
    setIsDropdownOpen(false);
    setCropSearchTerm("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start justify-center sm:justify-between w-full">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-between min-w-[200px] lg:min-w-[250px] border-green-200 hover:border-green-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedCrop.emoji}</span>
              <span className="font-medium">{selectedCrop.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-2" align="center">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search crop models..."
              value={cropSearchTerm}
              onChange={(e) => setCropSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredCrops.map((crop) => (
              <DropdownMenuItem
                key={crop.id}
                onClick={() => handleCropSelect(crop)}
                disabled={crop.disabled}
                className={`p-3 cursor-pointer ${
                  crop.disabled ? "opacity-50 cursor-not-allowed" : ""
                } ${selectedCrop.id === crop.id ? "bg-green-50" : ""}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-xl flex-shrink-0">{crop.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{crop.name}</h4>
                      <Badge
                        variant={crop.disabled ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {crop.disabled ? "Coming Soon" : crop.accuracy}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {crop.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {crop.diseases.slice(0, 2).map((disease) => (
                        <span
                          key={disease}
                          className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                        >
                          {disease}
                        </span>
                      ))}
                      {crop.diseases.length > 2 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          +{crop.diseases.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {filteredCrops.length === 0 && (
              <div className="p-3 text-sm text-gray-500 text-center">
                No crop models found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Badge
        variant="outline"
        className="text-green-700 border-green-200 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
      >
        <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Active Model
      </Badge>
    </div>
  );
}
