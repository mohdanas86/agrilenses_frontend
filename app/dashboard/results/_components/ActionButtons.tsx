import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActionButtons() {
  const router = useRouter();

  const handleLearnMore = () => {
    window.open("https://extension.umn.edu/diseases", "_blank");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Button
        onClick={() => router.push("/dashboard/scanner")}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        Scan Another Crop
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/history")}
        className="w-full border-green-200 hover:border-green-300"
      >
        View Scan History
      </Button>
      <Button
        variant="outline"
        onClick={handleLearnMore}
        className="w-full border-blue-200 hover:border-blue-300"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Learn More About Plant Diseases
      </Button>
    </div>
  );
}
