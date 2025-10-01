"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  RefreshCw,
  Calendar,
  Filter
} from "lucide-react";

export function QuickActions() {
  const trackDownload = useMutation(api.blocks.trackDownload);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackTestDownload = async () => {
    setIsTracking(true);
    try {
      await trackDownload({
        blockName: "test-block",
        blockType: "component",
        category: "testing",
        downloadSource: "website",
        userAgent: navigator.userAgent,
        ipAddressHash: "test-hash-" + Date.now(),
      });
    } catch (error) {
      console.error("Failed to track test download:", error);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleTrackTestDownload}
            disabled={isTracking}
            variant="outline"
          >
            {isTracking ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Track Test Download
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
