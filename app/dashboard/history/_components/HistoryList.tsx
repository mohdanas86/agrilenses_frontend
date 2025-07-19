import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Scan Records</CardTitle>
        <CardDescription className="text-sm">
          {filteredHistory.length} of {totalHistory} scans
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              No scan records found matching your criteria
            </p>
            <Button
              onClick={() => router.push("/dashboard/scanner")}
              className="bg-green-600 hover:bg-green-700"
            >
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
