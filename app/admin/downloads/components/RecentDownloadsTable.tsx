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
import { DownloadSourceBadge } from "./DownloadSourceBadge";

interface Download {
  id: string;
  blockName: string;
  blockType: string;
  category: string;
  downloadSource: string;
  timestamp: number;
  userAgent: string;
  ipAddressHash: string;
}

const formatTimestamp = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

const getBlockTypeBadge = (type: string) => {
  return (
    <Badge variant={type === "ui" ? "secondary" : "default"} className="text-xs">
      {type.toUpperCase()}
    </Badge>
  );
};

export function RecentDownloadsTable() {
  // In a real implementation, this would fetch recent downloads from Convex
  // For now, we'll use sample data
  const recentDownloads: Download[] = [
    {
      id: "1",
      blockName: "comp-001",
      blockType: "component",
      category: "forms",
      downloadSource: "cli",
      timestamp: Date.now() - 300000, // 5 minutes ago
      userAgent: "shadcn-cli/1.0.0",
      ipAddressHash: "abc123...",
    },
    {
      id: "2",
      blockName: "button",
      blockType: "ui",
      category: "ui",
      downloadSource: "website",
      timestamp: Date.now() - 600000, // 10 minutes ago
      userAgent: "Mozilla/5.0...",
      ipAddressHash: "def456...",
    },
    {
      id: "3",
      blockName: "comp-010",
      blockType: "component",
      category: "marketing",
      downloadSource: "api",
      timestamp: Date.now() - 900000, // 15 minutes ago
      userAgent: "PostmanRuntime/7.29.0",
      ipAddressHash: "ghi789...",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Downloads</CardTitle>
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
              {recentDownloads.map((download) => (
                <TableRow key={download.id}>
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
                    {download.userAgent}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {download.ipAddressHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
