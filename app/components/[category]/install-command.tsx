"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function InstallCommand({ componentName }: { componentName: string }) {
  const [copied, setCopied] = useState(false)
  const command = `npx shadcn@latest add https://d2studio.dev/r/${componentName}.json`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <pre className="rounded-md bg-background p-4 pr-12 overflow-x-auto">
        <code className="text-sm">{command}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 p-0"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">Copy command</span>
      </Button>
    </div>
  )
}