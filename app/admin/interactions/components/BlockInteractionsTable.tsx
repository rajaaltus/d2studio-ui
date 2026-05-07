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

function formatTimestamp(timestamp?: number) {
  if (!timestamp) return "—";
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getBlockTypeBadge(type: string) {
  return (
    <Badge variant={type === "ui" ? "secondary" : "default"} className="text-xs">
      {type.toUpperCase()}
    </Badge>
  );
}

function getEngagementScore(views: number, copies: number, installs: number, previews: number) {
  if (views === 0) return 0;
  const score = ((copies + installs + previews) / views) * 100;
  return Math.min(100, Math.round(score));
}

function getEngagementBadge(score: number, hasViews: boolean) {
  if (!hasViews) return <Badge variant="outline">No data</Badge>;
  if (score >= 80) return <Badge className="bg-green-500">High</Badge>;
  if (score >= 50) return <Badge variant="secondary">Medium</Badge>;
  return <Badge variant="outline">Low</Badge>;
}

interface BlockInteractionsTableProps {
  searchTerm?: string;
  typeFilter?: string;
}

const TYPE_FIELD: Record<string, "views" | "copies" | "installs" | "previews"> = {
  view: "views",
  copy: "copies",
  install: "installs",
  preview: "previews",
};

export function BlockInteractionsTable({
  searchTerm = "",
  typeFilter = "all",
}: BlockInteractionsTableProps = {}) {
  const interactions = useQuery(api.blocks.getBlockInteractionsList, { limit: 10 });

  if (!interactions) {
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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const typeField = TYPE_FIELD[typeFilter];
  const filtered = interactions.filter((stat) => {
    if (typeField && stat[typeField] === 0) return false;
    if (normalizedSearch && !stat.blockName.toLowerCase().includes(normalizedSearch)) {
      return false;
    }
    return true;
  });

  const isFiltered = typeFilter !== "all" || normalizedSearch.length > 0;
  const emptyMessage = interactions.length === 0
    ? "No interaction data yet."
    : "No interactions match the current filters.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Block Interactions
          {isFiltered && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({filtered.length} of {interactions.length})
            </span>
          )}
        </CardTitle>
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
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((stat) => {
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
                      <TableCell>{getEngagementBadge(engagementScore, stat.views > 0)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(stat.lastInteraction)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
