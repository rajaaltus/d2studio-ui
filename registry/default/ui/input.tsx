import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border-t border-x bg-background px-3 py-1 text-base outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "dark:shadow-[inset_0_-0.5px_0.1px_0px_color-mix(in_oklch,var(--foreground)_30%,transparent)] transition-[color,box-shadow]",
        "shadow-[inset_0_-0.5px_0.1px_0px_color-mix(in_oklch,var(--background)_99%,transparent)] transition-[color,box-shadow]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
