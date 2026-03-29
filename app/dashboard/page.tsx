"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromToken } from "@/lib/getUserFromToken";
import {
  User,
  Bell,
  Sparkles,
  Globe,
  Shield,
  Download,
  Smartphone,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  // ✅ ALL HOOKS FIRST (CRITICAL)
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);

  const {
    lowStimulus,
    toggleLowStimulus,
    animationsEnabled,
    toggleAnimations,
  } = useTheme();

  // ✅ AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  // ✅ LOAD USER DATA
useEffect(() => {
  const userData = getUserFromToken();

  if (userData) {
    setUser(userData);
  }
}, []);
  // ✅ SAFE LOADING STATE (NO HOOK BREAK)
  if (checkingAuth) {
    return null; // or loader
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and app preferences
          </p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input defaultValue={user?.name || ""} />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={user?.email || ""} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={user?.phone || ""} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={user?.role || ""} disabled />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <Label>Low Stimulus Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce visual noise
                </p>
              </div>
              <Switch
                checked={lowStimulus}
                onCheckedChange={toggleLowStimulus}
              />
            </div>

            <div className="flex justify-between">
              <div>
                <Label>Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable transitions
                </p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={toggleAnimations}
                disabled={lowStimulus}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Switch defaultChecked /> Push Notifications
            <Switch defaultChecked /> Email Updates
            <Switch defaultChecked /> Medication Reminders
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Language & Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input defaultValue="English (US)" />
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        {/* Install */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Install App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Add to Home Screen
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}