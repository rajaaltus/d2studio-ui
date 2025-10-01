import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Copy,
  Download,
  Play,
  Activity,
} from "lucide-react";

function InteractionTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "view":
      return <Eye className="h-4 w-4" />;
    case "copy":
      return <Copy className="h-4 w-4" />;
    case "install_copy":
      return <Download className="h-4 w-4" />;
    case "preview":
      return <Play className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

interface InteractionTypeBadgeProps {
  type: string;
}

export function InteractionTypeBadge({ type }: InteractionTypeBadgeProps) {
  const getVariant = () => {
    switch (type) {
      case "view":
        return "secondary";
      case "copy":
        return "default";
      case "install_copy":
        return "outline";
      case "preview":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getLabel = () => {
    switch (type) {
      case "view":
        return "View";
      case "copy":
        return "Copy";
      case "install_copy":
        return "Install";
      case "preview":
        return "Preview";
      default:
        return type;
    }
  };

  return (
    <Badge variant={getVariant()} className="text-xs">
      <InteractionTypeIcon type={type} />
      <span className="ml-1">{getLabel()}</span>
    </Badge>
  );
}
