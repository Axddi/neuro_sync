"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import {
  User,
  Bell,
  Sparkles,
  Moon,
  Globe,
  Shield,
  Download,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { lowStimulus, toggleLowStimulus, animationsEnabled, toggleAnimations } =
    useTheme();

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and app preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Sarah Chen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sarah.chen@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Primary Caregiver" disabled />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Accessibility
            </CardTitle>
            <CardDescription>
              Customize your experience for comfort and clarity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Low Stimulus Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduces visual noise with muted colors and minimal contrast
                </p>
              </div>
              <Switch
                checked={lowStimulus}
                onCheckedChange={toggleLowStimulus}
                aria-label="Toggle low stimulus mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable micro-interactions and transitions
                </p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={toggleAnimations}
                disabled={lowStimulus}
                aria-label="Toggle animations"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">High Contrast Text</Label>
                <p className="text-sm text-muted-foreground">
                  Increase text contrast for better readability
                </p>
              </div>
              <Switch aria-label="Toggle high contrast text" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Large Touch Targets</Label>
                <p className="text-sm text-muted-foreground">
                  Increase button and tap area sizes
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle large touch targets" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts on your device
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle push notifications" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get daily summaries via email
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle email updates" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Care Team Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Instant notifications for important updates
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle care team alerts" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Medication Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded before scheduled medications
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle medication reminders" />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language and timezone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" defaultValue="English (US)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="Pacific Time (PT)" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export My Data
            </Button>
            <p className="text-sm text-muted-foreground">
              Download a copy of all your data including logs, notes, and settings.
            </p>
          </CardContent>
        </Card>

        {/* Install App */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Install App
            </CardTitle>
            <CardDescription>
              Add NeuroSync to your home screen for quick access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Add to Home Screen
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
