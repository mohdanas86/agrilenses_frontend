import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScanRecord } from "./types";
import { BackButton } from "@/components/BackButton";

interface HistoryHeaderProps {
  onExport: () => void;
}

export function HistoryHeader({ onExport }: HistoryHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <BackButton title="Scan History" />
            {/* <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Scan History
            </h1> */}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
