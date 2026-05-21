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
import { DownloadSourceBadge } from "./DownloadSourceBadge";

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getBlockTypeBadge = (type: string) => {
  return (
    <Badge variant={type === "ui" ? "secondary" : "default"} className="text-xs">
      {type.toUpperCase()}
    </Badge>
  );
};

interface RecentDownloadsTableProps {
  searchTerm?: string;
  sourceFilter?: string;
}

export function RecentDownloadsTable({
  searchTerm = "",
  sourceFilter = "all",
}: RecentDownloadsTableProps = {}) {
  const recentDownloads = useQuery(api.blocks.getRecentDownloads, { limit: 20 });

  if (!recentDownloads) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span>Loading downloads...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = recentDownloads.filter((d) => {
    if (sourceFilter !== "all" && d.downloadSource !== sourceFilter) return false;
    if (normalizedSearch) {
      const haystack = `${d.blockName} ${d.category}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });

  const isFiltered = sourceFilter !== "all" || normalizedSearch.length > 0;
  const emptyMessage = recentDownloads.length === 0
    ? "No downloads tracked yet."
    : "No downloads match the current filters.";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Recent Downloads
          {isFiltered && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({filtered.length} of {recentDownloads.length})
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
                <TableHead>Source</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead>IP Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((download) => (
                  <TableRow key={download._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{download.blockName}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {download.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getBlockTypeBadge(download.blockType)}</TableCell>
                    <TableCell>
                      <DownloadSourceBadge source={download.downloadSource} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimestamp(download.timestamp)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {download.userAgent ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {download.ipAddressHash ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
