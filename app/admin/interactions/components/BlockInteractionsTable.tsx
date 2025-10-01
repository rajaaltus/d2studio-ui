"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

function formatTimestamp(timestamp: number) {
  const now = Date.now();
  const diff = now - timestamp;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
}

function getBlockTypeBadge(type: string) {
  return (
    <Badge variant={type === "ui" ? "secondary" : "default"} className="text-xs">
      {type.toUpperCase()}
    </Badge>
  );
}

function getEngagementScore(views: number, copies: number, installs: number, previews: number) {
  const score = ((copies + installs + previews) / views) * 100;
  return Math.min(100, Math.round(score));
}

function getEngagementBadge(score: number) {
  if (score >= 80) return <Badge className="bg-green-500">High</Badge>;
  if (score >= 50) return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

export function BlockInteractionsTable() {
  const blocks = useQuery(api.blocks.listBlocks, { limit: 10 });

  if (!blocks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Block Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Loading interactions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock interaction stats for demo
  const interactionStats = blocks.map((block) => ({
    blockName: block.name,
    blockType: block.type,
    views: Math.floor(Math.random() * 1000) + 100,
    copies: Math.floor(Math.random() * 200) + 10,
    installs: Math.floor(Math.random() * 150) + 5,
    previews: Math.floor(Math.random() * 300) + 20,
    lastInteraction: Date.now() - Math.floor(Math.random() * 86400000), // Random time in last 24h
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Block Interactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>Installs</TableHead>
                <TableHead>Previews</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interactionStats.map((stat) => {
                const engagementScore = getEngagementScore(
                  stat.views,
                  stat.copies,
                  stat.installs,
                  stat.previews
                );

                return (
                  <TableRow key={stat.blockName}>
                    <TableCell className="font-medium">{stat.blockName}</TableCell>
                    <TableCell>{getBlockTypeBadge(stat.blockType)}</TableCell>
                    <TableCell className="text-sm">{stat.views.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{stat.copies.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{stat.installs.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{stat.previews.toLocaleString()}</TableCell>
                    <TableCell>{getEngagementBadge(engagementScore)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatTimestamp(stat.lastInteraction)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
