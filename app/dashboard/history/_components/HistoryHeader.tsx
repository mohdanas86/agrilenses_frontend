import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface HistoryHeaderProps {
  onExport: () => void;
}

export function HistoryHeader({ onExport }: HistoryHeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <BackButton title="" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
