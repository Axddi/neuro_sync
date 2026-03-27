"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const careTeam = [
  {
    id: "1",
    name: "Dr. Emily Watson",
    role: "Neurologist",
    status: "online",
    initials: "EW",
    color: "bg-chart-1",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Physical Therapist",
    status: "online",
    initials: "MC",
    color: "bg-chart-2",
  },
  {
    id: "3",
    name: "Lisa Park",
    role: "Occupational Therapist",
    status: "offline",
    initials: "LP",
    color: "bg-chart-4",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Family Member",
    status: "away",
    initials: "JW",
    color: "bg-chart-5",
  },
];

const statusColors = {
  online: "bg-chart-2",
  away: "bg-chart-3",
  offline: "bg-muted-foreground",
};

export function CareTeamPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Care Team</CardTitle>
          <Badge variant="secondary" className="text-xs">
            2 Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {careTeam.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={cn("text-white", member.color)}>
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                  statusColors[member.status as keyof typeof statusColors]
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={`Message ${member.name}`}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={`Call ${member.name}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full mt-2 bg-transparent">
          <Video className="h-4 w-4 mr-2" />
          Start Team Call
        </Button>
      </CardContent>
    </Card>
  );
}
