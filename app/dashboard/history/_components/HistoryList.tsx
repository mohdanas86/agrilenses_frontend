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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-gray-600" />
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Scan Records
              </CardTitle>
              <CardDescription className="text-sm">
                {filteredHistory.length} of {totalHistory} scans displayed
              </CardDescription>
            </div>
          </div>

          {totalHistory > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Analyses</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalHistory}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-50 rounded-lg mb-6 w-fit mx-auto">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No scan records found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {totalHistory === 0
                ? "You haven't performed any plant scans yet. Start by scanning your first plant!"
                : "No scans match your current filter criteria. Try adjusting your search or filters."}
            </p>
            <Button
              onClick={() => router.push("/dashboard/scanner")}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Your First Scan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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
