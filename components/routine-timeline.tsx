"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { motion, Reorder } from "framer-motion";
import {
  Pill,
  UtensilsCrossed,
  Brain,
  Moon,
  Sun,
  Plus,
  GripVertical,
  Check,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RoutineItem = {
  id: string;
  title: string;
  time: string;
  type: "medication" | "meal" | "therapy" | "sleep" | "activity";
  completed: boolean;
  notes?: string;
};

const typeConfig = {
  medication: {
    icon: Pill,
    color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    label: "Medication",
  },
  meal: {
    icon: UtensilsCrossed,
    color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    label: "Meal",
  },
  therapy: {
    icon: Brain,
    color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    label: "Therapy",
  },
  sleep: {
    icon: Moon,
    color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
    label: "Sleep",
  },
  activity: {
    icon: Sun,
    color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    label: "Activity",
  },
};

const initialRoutine: RoutineItem[] = [
  {
    id: "1",
    title: "Morning Medication",
    time: "7:00 AM",
    type: "medication",
    completed: true,
    notes: "Donepezil 10mg with breakfast",
  },
  {
    id: "2",
    title: "Breakfast",
    time: "7:30 AM",
    type: "meal",
    completed: true,
  },
  {
    id: "3",
    title: "Cognitive Exercises",
    time: "9:00 AM",
    type: "therapy",
    completed: false,
    notes: "Memory games and puzzles",
  },
  {
    id: "4",
    title: "Morning Walk",
    time: "10:30 AM",
    type: "activity",
    completed: false,
    notes: "15-20 minutes in the garden",
  },
  {
    id: "5",
    title: "Lunch",
    time: "12:00 PM",
    type: "meal",
    completed: false,
  },
  {
    id: "6",
    title: "Afternoon Medication",
    time: "2:00 PM",
    type: "medication",
    completed: false,
    notes: "Memantine 10mg",
  },
  {
    id: "7",
    title: "Rest Time",
    time: "3:00 PM",
    type: "sleep",
    completed: false,
    notes: "Quiet time or nap",
  },
];

export function RoutineTimeline() {
  const [items, setItems] = useState<RoutineItem[]>(initialRoutine);
  const { animationsEnabled } = useTheme();

  const toggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Daily Routine
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {completedCount} of {items.length} tasks completed
            </p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <Reorder.Item
                key={item.id}
                value={item}
                dragListener={animationsEnabled}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  item.completed
                    ? "bg-muted/50 border-border"
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                {animationsEnabled && (
                  <button
                    className="mt-0.5 cursor-grab active:cursor-grabbing touch-none"
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}

                <button
                  onClick={() => toggleComplete(item.id)}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    item.completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                  aria-label={
                    item.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  {item.completed && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "font-medium text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-xs gap-1", config.color)}
                    >
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {item.notes}
                    </p>
                  )}
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </CardContent>
    </Card>
  );
}
