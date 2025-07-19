import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Leaf, ChevronRight } from "lucide-react";
import { ScanRecord } from "./types";

interface ScanRecordItemProps {
  record: ScanRecord;
  isClient: boolean;
  getTimeDifference: (date: Date) => string;
}

export function ScanRecordItem({
  record,
  isClient,
  getTimeDifference,
}: ScanRecordItemProps) {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
            {record.crop}
          </h3>
          {record.isHealthy ? (
            <Badge
              variant="default"
              className="flex items-center bg-green-100 text-green-800 border-green-200 text-xs"
            >
              <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              <span className="hidden sm:inline">Healthy</span>
              <span className="sm:hidden">OK</span>
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center text-xs">
              <AlertTriangle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              <span className="hidden sm:inline">{record.disease}</span>
              <span className="sm:hidden truncate max-w-[4rem]">
                {record.disease?.substring(0, 6)}...
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
          <span>{record.confidence}% confidence</span>
          <span>•</span>
          <span className="truncate">
            {getTimeDifference(record.timestamp)}
          </span>
          {record.location && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{record.location}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-center flex-shrink-0">
        <p className="text-xs sm:text-sm text-gray-500">
          {isClient ? record.timestamp.toLocaleDateString() : ""}
        </p>
        <p className="text-xs text-gray-400">
          {isClient
            ? record.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
    </div>
  );
}
