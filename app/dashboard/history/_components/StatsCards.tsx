import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";
import { HistoryStats } from "./types";

interface StatsCardsProps {
  stats: HistoryStats;
}

const MetricCard = memo(
  ({
    title,
    value,
    icon: Icon,
    type = "neutral",
    description,
  }: {
    title: string;
    value: string | number;
    icon: any;
    type?: "neutral" | "success" | "warning" | "info";
    description?: string;
  }) => {
    const getStyles = () => {
      switch (type) {
        case "success":
          return {
            border: "border-green-200",
            bg: "bg-green-50",
            icon: "text-green-600",
            text: "text-green-900",
            value: "text-green-800",
          };
        case "warning":
          return {
            border: "border-red-200",
            bg: "bg-red-50",
            icon: "text-red-600",
            text: "text-red-900",
            value: "text-red-800",
          };
        case "info":
          return {
            border: "border-blue-200",
            bg: "bg-blue-50",
            icon: "text-blue-600",
            text: "text-blue-900",
            value: "text-blue-800",
          };
        default:
          return {
            border: "border-gray-200",
            bg: "bg-gray-50",
            icon: "text-gray-600",
            text: "text-gray-900",
            value: "text-gray-800",
          };
      }
    };

    const styles = getStyles();

    return (
      <Card
        className={`border ${styles.border} shadow-sm bg-white hover:shadow-md transition-shadow duration-200`}
      >
        <CardContent className="p-4 sm:p-6">
          <div
            className={`p-2 sm:p-3 ${styles.bg} rounded-lg mb-3 sm:mb-4 w-fit`}
          >
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${styles.icon}`} />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {title}
            </p>
            <p className={`text-2xl sm:text-3xl font-bold ${styles.value}`}>
              {value}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-gray-500">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";

export const StatsCards = memo(({ stats }: StatsCardsProps) => {
  const statItems = [
    {
      title: "Total Plant Scans",
      value: stats.totalScans,
      icon: Activity,
      type: "neutral" as const,
      description: "Completed analyses",
    },
    {
      title: "Healthy Plants",
      value: stats.healthyCount,
      icon: Shield,
      type: "success" as const,
      description: "No diseases detected",
    },
    {
      title: "Issues Detected",
      value: stats.diseasedCount,
      icon: AlertTriangle,
      type: "warning" as const,
      description: "Requiring attention",
    },
    {
      title: "Health Success Rate",
      value: `${stats.successRate}%`,
      icon: Target,
      type: "info" as const,
      description: "Overall plant health",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((item, index) => (
        <MetricCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          type={item.type}
          description={item.description}
        />
      ))}
    </div>
  );
});

StatsCards.displayName = "StatsCards";
