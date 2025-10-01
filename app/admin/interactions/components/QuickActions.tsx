"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Copy,
  Download,
  Play,
} from "lucide-react";

export function QuickActions() {
  const trackInteraction = useMutation(api.blocks.trackBlockInteraction);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackTestInteraction = async (type: "view" | "copy" | "install_copy" | "preview") => {
    setIsTracking(true);
    try {
      await trackInteraction({
        blockName: "test-block",
        interactionType: type,
      });
    } catch (error) {
      console.error("Failed to track test interaction:", error);
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button
            onClick={() => handleTrackTestInteraction("view")}
            disabled={isTracking}
            variant="outline"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Track View
          </Button>
          <Button
            onClick={() => handleTrackTestInteraction("copy")}
            disabled={isTracking}
            variant="outline"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Track Copy
          </Button>
          <Button
            onClick={() => handleTrackTestInteraction("install_copy")}
            disabled={isTracking}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Track Install
          </Button>
          <Button
            onClick={() => handleTrackTestInteraction("preview")}
            disabled={isTracking}
            variant="outline"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Track Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
