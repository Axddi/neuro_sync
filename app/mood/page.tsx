"use client";
import { api } from "@/lib/api";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Sparkles,
  Moon,
  Coffee,
  Heart,
  Clock,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
type MoodLevel = "great" | "good" | "okay" | "low" | "difficult";
type LogEntry = {
  id: string;
  mood: MoodLevel;
  tags: string[];
  notes: string;
  timestamp: Date;
};

const moodOptions: {
  level: MoodLevel;
  label: string;
  icon: typeof Smile;
  color: string;
  bgColor: string;
}[] = [
  {
    level: "great",
    label: "Great",
    icon: Sparkles,
    color: "text-chart-2",
    bgColor: "bg-chart-2/20 border-chart-2/30",
  },
  {
    level: "good",
    label: "Good",
    icon: Smile,
    color: "text-chart-3",
    bgColor: "bg-chart-3/20 border-chart-3/30",
  },
  {
    level: "okay",
    label: "Okay",
    icon: Meh,
    color: "text-chart-1",
    bgColor: "bg-chart-1/20 border-chart-1/30",
  },
  {
    level: "low",
    label: "Low",
    icon: Frown,
    color: "text-chart-4",
    bgColor: "bg-chart-4/20 border-chart-4/30",
  },
  {
    level: "difficult",
    label: "Difficult",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/20 border-destructive/30",
  },
];

const quickTags = [
  { label: "Slept Well", icon: Moon },
  { label: "Good Appetite", icon: Coffee },
  { label: "Social", icon: Heart },
  { label: "Confused", icon: AlertCircle },
  { label: "Agitated", icon: Frown },
  { label: "Calm", icon: Smile },
  { label: "Active", icon: Sparkles },
  { label: "Tired", icon: Moon },
];

const recentLogs: LogEntry[] = [
  {
    id: "1",
    mood: "good",
    tags: ["Slept Well", "Calm"],
    notes: "Had a peaceful morning. Enjoyed breakfast together.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    mood: "okay",
    tags: ["Confused", "Tired"],
    notes: "Some confusion during lunch. Needed extra support.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "3",
    mood: "great",
    tags: ["Social", "Active"],
    notes: "Great therapy session. Very engaged and responsive.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

export default function MoodLoggerPage() {
  const [role, setRole] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>(recentLogs);
  const [showSuccess, setShowSuccess] = useState(false);
  const { animationsEnabled } = useTheme();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

const handleSubmit = async () => {
  if (!selectedMood) return;

  const newLog = {
    id: Date.now().toString(),
    mood: selectedMood,
    tags: selectedTags,
    notes,
    timestamp: new Date(),
  };

  try {
  await api("/logs", {
    method: "POST",
    body: JSON.stringify({
      mood: selectedMood,
      notes,
      tags: selectedTags,
    }),
  });

    setLogs([newLog, ...logs]);
    setSelectedMood(null);
    setSelectedTags([]);
    setNotes("");
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2000);
  } catch (err) {
    console.error("Failed to save:", err);
    alert("Failed to save ❌");
  }
};

const formatTime = (date: any) => {
  const parsedDate = new Date(date); 

  const now = new Date();
  const diff = now.getTime() - parsedDate.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
useEffect(() => {
  if (typeof document !== "undefined") {
  const hasToken = document.cookie.includes("token=");

  if (!hasToken) {
    window.location.href = "/login";
    return;
  }
}

  const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

setRole(user?.role || null);

  const fetchLogs = async () => {
    const res = await api("/logs");

    if (res.logs) {
    const mapped = res.logs.map((log: any) => ({
      id: log.SK, 
      mood: log.mood,
      tags: log.tags || [],
      notes: log.notes,
      timestamp: log.createdAt,
    }));

      setLogs(
        mapped.sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        )
      );
    }
  };

  fetchLogs();
}, []);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mood Logger</h1>
          {role && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {role}
              </Badge>
            </div>
          )}
          <p className="text-muted-foreground mt-1">
            Track behaviors and milestones with quick entries
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Add Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Quick Add Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  How is the mood right now?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {moodOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedMood === option.level;
                    return (
                      <button
                        key={option.level}
                        onClick={() => setSelectedMood(option.level)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? option.bgColor
                            : "border-border hover:border-primary/30 bg-card"
                        )}
                        aria-label={`Select ${option.label} mood`}
                      >
                        <Icon
                          className={cn(
                            "h-6 w-6 transition-colors",
                            isSelected ? option.color : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isSelected ? option.color : "text-muted-foreground"
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Tags */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Quick Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickTags.map((tag) => {
                    const Icon = tag.icon;
                    const isSelected = selectedTags.includes(tag.label);
                    return (
                      <button
                        key={tag.label}
                        onClick={() => toggleTag(tag.label)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Notes (optional)
                </label>
                <Textarea
                  placeholder="Add any observations or details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || role !== "caregiver"}
                className="w-full"
                size="lg"
              >
                {role === "doctor" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Only caregivers can log mood entries
                  </p>
                )}
                {showSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Entry Logged
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Log Entry
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {logs.map((log, index) => {
                    const moodConfig = moodOptions.find(
                      (m) => m.level === log.mood
                    );
                    if (!moodConfig) return null;
                    const MoodIcon = moodConfig.icon;

                    const content = (
                      <div
                        className={cn(
                          "p-4 rounded-xl border",
                          moodConfig.bgColor
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MoodIcon
                              className={cn("h-5 w-5", moodConfig.color)}
                            />
                            <span
                              className={cn(
                                "font-medium text-sm",
                                moodConfig.color
                              )}
                            >
                              {moodConfig.label}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(log.timestamp)}
                          </span>
                        </div>

                        {log.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {log.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {log.notes && (
                          <p className="text-sm text-foreground mt-2">
                            {log.notes}
                          </p>
                        )}
                      </div>
                    );

                    if (animationsEnabled) {
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          {content}
                        </motion.div>
                      );
                    }

                    return <div key={log.id}>{content}</div>;
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
