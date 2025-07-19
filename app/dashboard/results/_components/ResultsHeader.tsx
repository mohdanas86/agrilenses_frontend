import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResultsHeaderProps {
  onShare: () => void;
}

export function ResultsHeader({ onShare }: ResultsHeaderProps) {
  const router = useRouter();

  return (
    <header className=" bg-transparent py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <BackButton title={"Crop Result"} />
            {/* <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Scan Results
            </h1> */}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
