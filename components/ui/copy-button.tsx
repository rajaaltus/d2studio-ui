"use client"

import * as React from "react"
import { Clipboard, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn, copyText } from "@/lib/utils"

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string
  className?: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  const copyToClipboard = React.useCallback(async () => {
    try {
      await copyText(value)
      setHasCopied(true)
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
    }
  }, [value])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        "[&_svg]:h-3 [&_svg]:w-3",
        className
      )}
      onClick={copyToClipboard}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <Check /> : <Clipboard />}
    </Button>
  )
}