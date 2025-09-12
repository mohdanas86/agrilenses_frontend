import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Activity, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScanRecord } from "./types";
import { ScanRecordItem } from "./ScanRecordItem";

interface HistoryListProps {
  filteredHistory: ScanRecord[];
  totalHistory: number;
  isClient: boolean;
  getTimeDifference: (date: Date) => string;
}

export function HistoryList({
  filteredHistory,
  totalHistory,
  isClient,
  getTimeDifference,
}: HistoryListProps) {
  const router = useRouter();

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                Scan Records
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredHistory.length} of {totalHistory} scans displayed
              </CardDescription>
            </div>
          </div>

          {totalHistory > 0 && (
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Total Analyses</p>
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {totalHistory}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg mb-4 sm:mb-6 w-fit mx-auto">
              <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 px-4">
              No scan records found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto px-4">
              {totalHistory === 0
                ? "You haven't performed any plant scans yet. Start by scanning your first plant!"
                : "No scans match your current filter criteria. Try adjusting your search or filters."}
            </p>
            <Button
              onClick={() => router.push("/dashboard/scanner")}
              className="bg-gray-900 hover:bg-gray-800 text-white h-10 sm:h-11 px-4 sm:px-6"
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Your First Scan
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredHistory.map((record) => (
              <ScanRecordItem
                key={record.id}
                record={record}
                isClient={isClient}
                getTimeDifference={getTimeDifference}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
