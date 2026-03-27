"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { StatsCards } from "@/components/stats-cards";
import { RoutineTimeline } from "@/components/routine-timeline";
import { QuickActions } from "@/components/quick-actions";
import { CareTeamPanel } from "@/components/care-team-panel";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/auth";

export default function DashboardPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("token", "eyJraWQiOiJrRXlrbTVKVmxxWVRJSmpJeXRuQnZsQWJmMFl6ZGQwcWFRS0J1QjN4VnJnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1MTQzM2Q3YS1hMDAxLTcwMDItZDJmYS1jZjI4MTJjMzI3MjUiLCJjb2duaXRvOmdyb3VwcyI6WyJjYXJlZ2l2ZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9SaFVtdENGaHgiLCJjb2duaXRvOnVzZXJuYW1lIjoiYWRtaW4iLCJvcmlnaW5fanRpIjoiMWRlZTU1ZGMtMTg0My00M2MyLWI5YmItODExZTczMmMxZTU1IiwiYXVkIjoiN24yNzAybzJjdTdlZjBsOHJoMm85MzB0bGoiLCJldmVudF9pZCI6ImJjMzljOGY2LWYwYTQtNDE1NC05N2IxLWNhOThiMmQwMmI0OCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzc0NjM3NTgwLCJleHAiOjE3NzQ2NDExODAsImlhdCI6MTc3NDYzNzU4MCwianRpIjoiZmQ0NTUyZDItZTA0MS00NjYwLWI0ZmMtODg2NDhjY2QzZDNhIiwiZW1haWwiOiJhYWRpdHlhMjJzYXhlbmFAZ21haWwuY29tIn0.r5pM7geilygV2uKFCcELNxOpOGQYFrP5yvcdDugs2cWznuy__jf6LrNUsa_yBuX7By5dIhWdDUslcdNGRkq3uSQcRyDrPqodxkwwQFQxb2-Gq0Z0bz_CgVXxGPFi373BjNP6jFGpZ8vZYdv86fX5CyHZkFvtcywugYQW44oQX6APlCGBcXZ-DR0G4R_R8IPIhPlWZcPkvZzA08WxwWv561HJsQiZu1OPLEiWfoiQ0orhGbR1Gcubq3c5QPZazKyC4mHXph4CawHEt3-1L2ws16w52cnxAqIkTwtZZL2yW_45XRg6yF-5Sp1YAV-4h4yH6u8vjZBUH45XEIDzovtRIQ");

    const r = getUserRole();
    setRole(r);
  }, []);

  if (!role) return null;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground text-balance">
            Good morning, Sarah
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's how Margaret is doing today"}
          </p>
        </div>

        {/* 🔥 ROLE-BASED BUTTONS */}
        <div className="flex gap-3">
          {role === "caregiver" && (
            <button className="px-4 py-2 bg-primary text-white rounded">
              Send Reminder
            </button>
          )}

          {role === "doctor" && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              View Reports
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoutineTimeline />
          </div>

          <div className="space-y-6">
            <QuickActions />
            <CareTeamPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}