"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { Heart, Calendar, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Mood Today",
    value: "Good",
    subtext: "Better than yesterday",
    icon: Heart,
    trend: "+12%",
    trendUp: true,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Tasks Done",
    value: "5/8",
    subtext: "On track for today",
    icon: Calendar,
    trend: "63%",
    trendUp: true,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    label: "Care Team",
    value: "4",
    subtext: "2 active now",
    icon: Users,
    trend: "Online",
    trendUp: true,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    label: "Weekly Progress",
    value: "87%",
    subtext: "Routine adherence",
    icon: TrendingUp,
    trend: "+5%",
    trendUp: true,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
];

export function StatsCards() {
  const { animationsEnabled } = useTheme();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const content = (
          <Card
            key={stat.label}
            className="relative overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded",
                    stat.trendUp
                      ? "text-chart-2 bg-chart-2/10"
                      : "text-destructive bg-destructive/10"
                  )}
                >
                  {stat.trend}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        );

        if (animationsEnabled) {
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {content}
            </motion.div>
          );
        }

        return <div key={stat.label}>{content}</div>;
      })}
    </div>
  );
}
