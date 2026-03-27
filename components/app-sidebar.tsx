"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import {
  Brain,
  Calendar,
  Heart,
  Users,
  MessageSquare,
  Settings,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/", icon: Calendar },
  { name: "Mood Logger", href: "/mood", icon: Heart },
  { name: "Care Feed", href: "/feed", icon: MessageSquare },
  { name: "Community", href: "/community", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { lowStimulus, toggleLowStimulus, animationsEnabled, toggleAnimations } =
    useTheme();

  const MotionWrapper = animationsEnabled ? motion.div : "div";

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-sidebar-border",
          "transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              NeuroSync
            </h1>
            <p className="text-xs text-muted-foreground">Cognitive Care</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Settings Panel */}
        <div className="border-t border-sidebar-border p-4 space-y-4">
          {/* Low Stimulus Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-sidebar-foreground">
                Low Stimulus
              </span>
            </div>
            <Switch
              checked={lowStimulus}
              onCheckedChange={toggleLowStimulus}
              aria-label="Toggle low stimulus mode"
            />
          </div>

          {/* Animations Toggle */}
          {!lowStimulus && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-sidebar-foreground">
                  Animations
                </span>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={toggleAnimations}
                aria-label="Toggle animations"
              />
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <span className="text-sm font-medium">SC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Sarah Chen
              </p>
              <p className="text-xs text-muted-foreground">Primary Caregiver</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
