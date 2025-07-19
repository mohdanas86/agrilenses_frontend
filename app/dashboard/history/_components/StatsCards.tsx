import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, AlertTriangle, Calendar } from "lucide-react";
import { HistoryStats } from "./types";

interface StatsCardsProps {
  stats: HistoryStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalScans}
              </p>
              <p className="text-sm text-gray-600">Total Scans</p>
            </div>
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.healthyCount}
              </p>
              <p className="text-sm text-gray-600">Healthy Plants</p>
            </div>
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {stats.diseasedCount}
              </p>
              <p className="text-sm text-gray-600">Diseases Found</p>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {stats.successRate}%
              </p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
