"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getUserRole } from "@/lib/auth";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Paperclip,
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  ImageIcon as ImageIconComponent,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
type FeedItem = {
  id: string;
  author: {
    name: string;
    role: string;
    initials: string;
    color: string;
  };
  content: string;
  timestamp: Date;
  type: "note" | "update" | "alert" | "milestone";
  likes: number;
  replies: number;
  liked: boolean;
};

const feedData: FeedItem[] = [
  {
    id: "1",
    author: {
      name: "Dr. Emily Watson",
      role: "Neurologist",
      initials: "EW",
      color: "bg-chart-1",
    },
    content:
      "Great progress in today's cognitive assessment. Memory recall improved by 15% compared to last month. Continue with current therapy schedule and medication.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: "update",
    likes: 3,
    replies: 2,
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Sarah Chen",
      role: "Primary Caregiver",
      initials: "SC",
      color: "bg-chart-2",
    },
    content:
      "Had a wonderful morning walk in the garden today. Margaret remembered the names of several flowers and was very engaged. This is a great milestone!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "milestone",
    likes: 5,
    replies: 4,
    liked: true,
  },
  {
    id: "3",
    author: {
      name: "Michael Chen",
      role: "Physical Therapist",
      initials: "MC",
      color: "bg-chart-4",
    },
    content:
      "Note: Please ensure Margaret does the gentle stretching exercises before breakfast. This helps with mobility throughout the day.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: "note",
    likes: 2,
    replies: 1,
    liked: false,
  },
  {
    id: "4",
    author: {
      name: "Lisa Park",
      role: "Occupational Therapist",
      initials: "LP",
      color: "bg-chart-5",
    },
    content:
      "Alert: Margaret showed some signs of confusion during the afternoon session. Monitor closely and ensure a calm environment.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: "alert",
    likes: 1,
    replies: 3,
    liked: false,
  },
];

const typeConfig = {
  note: {
    icon: FileText,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    label: "Note",
  },
  update: {
    icon: CheckCircle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    label: "Update",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Alert",
  },
  milestone: {
    icon: Heart,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    label: "Milestone",
  },
};

export default function CareFeedPage() {
  const [role, setRole] = useState<string | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const { animationsEnabled } = useTheme();
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  setRole(getUserRole());

  const fetchLogs = async () => {
    const res = await api("/logs");

    if (res.logs) {
      const mapped = res.logs.map((log: any) => ({
        id: log.PK,
        author: {
          name: "Caregiver",
          role: "System",
          initials: "NS",
          color: "bg-chart-2",
        },
        content: `${log.mood} - ${log.notes}`,
        timestamp: new Date(log.createdAt),
        type: log.type === "post" ? "update" : "note",
        likes: 0,
        replies: 0,
        liked: false,
      }));

      setFeed(
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

  const toggleLike = (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

const handlePost = async () => {
  if (!newPost.trim()) return;

  const newItem = {
    id: Date.now().toString(),
    type: "post",
    mood: "note",
    notes: newPost,
    tags: [],
  };

  try {
    // ✅ SEND TO AWS
    await api("/logs", {
      method: "POST",
      body: JSON.stringify(newItem),
    });

    // ✅ Optimistic UI
    setFeed([
      {
        id: newItem.id,
        author: {
          name: "You",
          role: "Caregiver",
          initials: "SC",
          color: "bg-chart-2",
        },
        content: newPost,
        timestamp: new Date(),
        type: "update", // 🔥 IMPORTANT
        likes: 0,
        replies: 0,
        liked: false,
      },
      ...feed,
    ]);

    setNewPost("");
  } catch (err) {
    console.error("Post failed:", err);
    alert("Failed to post ❌");
  }
};

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredFeed =
    filter === "all" ? feed : feed.filter((item) => item.type === filter);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Care Feed</h1>
          {role && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {role}
              </Badge>
            </div>
          )}
          <p className="text-muted-foreground mt-1">
            Real-time updates and notes from the care team
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compose Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-chart-2 text-white">
                      SC
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Share an update with the care team..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          Attach
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <ImageIconComponent className="h-4 w-4 mr-1" />
                          Photo
                        </Button>
                      </div>
                      <Button
                        onClick={handlePost}
                        disabled={!newPost.trim() || role !== "caregiver"}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feed Items */}
            <AnimatePresence mode="popLayout">
              {filteredFeed.map((item, index) => {
                const config = typeConfig[item.type];
                const TypeIcon = config.icon;

                const content = (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback
                            className={cn("text-white", item.author.color)}
                          >
                            {item.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-foreground">
                                  {item.author.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-normal"
                                >
                                  {item.author.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(item.timestamp)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs gap-1",
                                    config.color,
                                    config.bgColor
                                  )}
                                >
                                  <TypeIcon className="h-3 w-3" />
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-foreground mt-3 leading-relaxed">
                            {item.content}
                          </p>

                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                            <button
                              onClick={() => toggleLike(item.id)}
                              className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                item.liked
                                  ? "text-chart-4"
                                  : "text-muted-foreground hover:text-chart-4"
                              )}
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4",
                                  item.liked && "fill-current"
                                )}
                              />
                              {item.likes}
                            </button>
                            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                              <MessageSquare className="h-4 w-4" />
                              {item.replies} replies
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                if (animationsEnabled) {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      {content}
                    </motion.div>
                  );
                }

                return <div key={item.id}>{content}</div>;
              })}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Filter Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Filter By</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {[
                    { value: "all", label: "All Updates" },
                    { value: "note", label: "Notes" },
                    { value: "update", label: "Updates" },
                    { value: "alert", label: "Alerts" },
                    { value: "milestone", label: "Milestones" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        filter === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {[
                    { name: "Dr. Emily Watson", status: "Posted 30m ago" },
                    { name: "Sarah Chen", status: "Active now" },
                    { name: "Michael Chen", status: "Posted 5h ago" },
                    { name: "Lisa Park", status: "Posted 8h ago" },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground">
                        {member.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
