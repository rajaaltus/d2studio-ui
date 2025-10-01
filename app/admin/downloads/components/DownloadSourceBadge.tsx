import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Globe,
  Activity,
  ExternalLink,
  Download
} from "lucide-react";

interface DownloadSourceIconProps {
  source: string;
}

function DownloadSourceIcon({ source }: DownloadSourceIconProps) {
  switch (source) {
    case "cli":
      return <Terminal className="h-4 w-4" />;
    case "website":
      return <Globe className="h-4 w-4" />;
    case "api":
      return <Activity className="h-4 w-4" />;
    case "direct":
      return <ExternalLink className="h-4 w-4" />;
    default:
      return <Download className="h-4 w-4" />;
  }
}

interface DownloadSourceBadgeProps {
  source: string;
}

export function DownloadSourceBadge({ source }: DownloadSourceBadgeProps) {
  const getVariant = () => {
    switch (source) {
      case "cli":
        return "default" as const;
      case "website":
        return "secondary" as const;
      case "api":
        return "outline" as const;
      default:
        return "destructive" as const;
    }
  };

  return (
    <Badge variant={getVariant()} className="text-xs">
      <DownloadSourceIcon source={source} />
      <span className="ml-1">{source.toUpperCase()}</span>
    </Badge>
  );
}
