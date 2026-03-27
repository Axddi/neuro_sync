"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pill,
  AlertTriangle,
  Phone,
  FileText,
  Plus,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Log Medication",
    icon: Pill,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10 hover:bg-chart-1/20",
  },
  {
    label: "Report Incident",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10 hover:bg-destructive/20",
  },
  {
    label: "Call Care Team",
    icon: Phone,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10 hover:bg-chart-2/20",
  },
  {
    label: "Add Note",
    icon: FileText,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10 hover:bg-chart-4/20",
  },
  {
    label: "Voice Note",
    icon: Mic,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10 hover:bg-chart-5/20",
  },
  {
    label: "Quick Add",
    icon: Plus,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10 hover:bg-chart-3/20",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="ghost"
                className={cn(
                  "h-auto flex-col gap-2 py-4 px-3 transition-colors",
                  action.bgColor
                )}
              >
                <Icon className={cn("h-5 w-5", action.color)} />
                <span className="text-xs font-medium text-foreground">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
