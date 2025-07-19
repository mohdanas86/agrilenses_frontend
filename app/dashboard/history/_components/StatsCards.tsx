import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, AlertTriangle, Calendar } from "lucide-react";
import { HistoryStats } from "./types";

interface StatsCardsProps {
  stats: HistoryStats;
}

const StatCard = memo(
  ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = "StatCard";

export const StatsCards = memo(({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      title: "Total Scans",
      value: stats.totalScans,
      icon: Leaf,
      color: "text-gray-900",
    },
    {
      title: "Healthy Plants",
      value: stats.healthyCount,
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Diseases Found",
      value: stats.diseasedCount,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      icon: Calendar,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
});

StatsCards.displayName = "StatsCards";
