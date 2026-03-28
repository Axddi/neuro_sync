"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Patient = {
  id: string;
  name: string;
  initials: string;
  color: string;
  condition: string;
  caregiver: string;
  lastUpdate: Date;
  status: "stable" | "attention" | "critical";
  moodTrend: "up" | "stable" | "down";
  tasksCompleted: number;
  totalTasks: number;
};

const patients: Patient[] = [
  {
    id: "1",
    name: "Margaret Chen",
    initials: "MC",
    color: "bg-chart-1",
    condition: "Alzheimer's (Stage 2)",
    caregiver: "Sarah Chen",
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    status: "stable",
    moodTrend: "up",
    tasksCompleted: 5,
    totalTasks: 8,
  },
  {
    id: "2",
    name: "Robert Williams",
    initials: "RW",
    color: "bg-chart-2",
    condition: "ADHD + Autism",
    caregiver: "Emily Williams",
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "attention",
    moodTrend: "stable",
    tasksCompleted: 3,
    totalTasks: 6,
  },
  {
    id: "3",
    name: "Helen Park",
    initials: "HP",
    color: "bg-chart-4",
    condition: "Alzheimer's (Stage 3)",
    caregiver: "James Park",
    lastUpdate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "stable",
    moodTrend: "up",
    tasksCompleted: 7,
    totalTasks: 7,
  },
  {
    id: "4",
    name: "David Martinez",
    initials: "DM",
    color: "bg-chart-5",
    condition: "Autism Spectrum",
    caregiver: "Maria Martinez",
    lastUpdate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "critical",
    moodTrend: "down",
    tasksCompleted: 2,
    totalTasks: 5,
  },
  {
    id: "5",
    name: "Susan Taylor",
    initials: "ST",
    color: "bg-chart-3",
    condition: "Alzheimer's (Stage 1)",
    caregiver: "John Taylor",
    lastUpdate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "stable",
    moodTrend: "stable",
    tasksCompleted: 4,
    totalTasks: 5,
  },
];

const statusConfig = {
  stable: {
    label: "Stable",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10 border-chart-2/20",
  },
  attention: {
    label: "Needs Attention",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10 border-chart-3/20",
  },
  critical: {
    label: "Critical",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/20",
  },
};

const trendConfig = {
  up: { icon: TrendingUp, color: "text-chart-2", label: "Improving" },
  stable: { icon: Heart, color: "text-chart-1", label: "Stable" },
  down: { icon: AlertTriangle, color: "text-destructive", label: "Declining" },
};

export default function CommunityDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { animationsEnabled } = useTheme();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.caregiver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: patients.length,
    stable: patients.filter((p) => p.status === "stable").length,
    attention: patients.filter((p) => p.status === "attention").length,
    critical: patients.filter((p) => p.status === "critical").length,
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Community Care
            </h1>
            <p className="text-muted-foreground mt-1">
              Overview of all patients in your care network
            </p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total Patients",
              value: stats.total,
              icon: Users,
              color: "text-chart-1",
              bgColor: "bg-chart-1/10",
            },
            {
              label: "Stable",
              value: stats.stable,
              icon: Heart,
              color: "text-chart-2",
              bgColor: "bg-chart-2/10",
            },
            {
              label: "Need Attention",
              value: stats.attention,
              icon: Clock,
              color: "text-chart-3",
              bgColor: "bg-chart-3/10",
            },
            {
              label: "Critical",
              value: stats.critical,
              icon: AlertTriangle,
              color: "text-destructive",
              bgColor: "bg-destructive/10",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const content = (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                      <Icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
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

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients or caregivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "stable", label: "Stable" },
                  { value: "attention", label: "Attention" },
                  { value: "critical", label: "Critical" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                    className="whitespace-nowrap"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map((patient, index) => {
            const status = statusConfig[patient.status];
            const trend = trendConfig[patient.moodTrend];
            const TrendIcon = trend.icon;
            const progress =
              (patient.tasksCompleted / patient.totalTasks) * 100;

            const content = (
              <Card
                key={patient.id}
                className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer",
                  patient.status === "critical" && "border-destructive/30"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback
                          className={cn("text-white text-lg", patient.color)}
                        >
                          {patient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {patient.condition}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Status & Trend */}
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", status.color, status.bgColor)}
                      >
                        {status.label}
                      </Badge>
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          trend.color
                        )}
                      >
                        <TrendIcon className="h-3.5 w-3.5" />
                        {trend.label}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          Daily Progress
                        </span>
                        <span className="text-foreground font-medium">
                          {patient.tasksCompleted}/{patient.totalTasks}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            progress === 100 ? "bg-chart-2" : "bg-primary"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {patient.caregiver}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatTime(patient.lastUpdate)}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-3 text-primary hover:text-primary"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            );

            if (animationsEnabled) {
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {content}
                </motion.div>
              );
            }

            return <div key={patient.id}>{content}</div>;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export {};