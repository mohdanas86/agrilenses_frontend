import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScanResult } from "./types";

interface ScannedImageProps {
  scanResult: ScanResult;
}

export function ScannedImage({ scanResult }: ScannedImageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Scanned Image</CardTitle>
        <CardDescription className="text-sm">
          The image analyzed by our AI system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden shadow-sm">
          <img
            src={scanResult.image}
            alt="Scanned crop"
            className="w-full rounded-lg shadow-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      </CardContent>
    </Card>
  );
}
