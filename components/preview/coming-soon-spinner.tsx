import "./coming-soon-spinner.css";
import { cn } from "@/lib/utils";

interface ComingSoonSpinnerProps {
  className?: string;
}

export function ComingSoonSpinner({ className }: ComingSoonSpinnerProps) {
  return (
    <div
      className={cn("cs-spinner", className)}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`cs-cell cs-c${i}`} />
      ))}
    </div>
  );
}
