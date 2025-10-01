"use client"

import * as React from "react"
import { codeToHtml } from "shiki"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"

interface SyntaxHighlighterProps {
  code: string
  language?: string
  filename?: string
  withMeta?: boolean
  className?: string
}

export function SyntaxHighlighter({
  code,
  language = "tsx",
  filename,
  withMeta = false,
  className
}: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function highlightCode() {
      try {
        setIsLoading(true)
        const html = await codeToHtml(code, {
          lang: language,
          theme: "github-dark-default",
          transformers: [
            {
              pre(node) {
                // Add custom classes to the pre element
                const existingClass = this.addClassToHast(node, "mb-0 rounded-none bg-transparent")
                node.properties.class = cn(existingClass, "overflow-x-auto text-sm")
              },
              code(node) {
                // Add custom classes to the code element
                this.addClassToHast(node, "grid min-w-full break-words rounded-none border-0 bg-transparent p-0")
              },
              line(node, line) {
                // Add line styling
                this.addClassToHast(node, "px-4 py-0.5 min-h-[1rem] w-full inline-block")
                if (node.children.length === 0) {
                  node.children = [{ type: "text", value: " " }]
                }
              }
            }
          ]
        })
        setHighlightedCode(html)
      } catch (error) {
        console.error("Syntax highlighting failed:", error)
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${code}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language])

  if (isLoading) {
    return (
      <div className="group relative overflow-hidden rounded-xl border bg-zinc-950 dark:bg-zinc-900">
        <div className="animate-pulse py-4 px-4">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-zinc-950 dark:bg-zinc-900">
      {/* File meta info */}
      {withMeta && filename && (
        <div className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm font-medium text-zinc-400">{filename}</span>
          </div>
        </div>
      )}

      {/* Syntax highlighted code */}
      <div
        className={cn(
          "relative overflow-x-auto py-4 max-h-[650px] text-white",
          "[&_pre]:mb-0 [&_pre]:rounded-none [&_pre]:bg-transparent [&_pre]:p-0",
          className
        )}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />

      {/* Copy button */}
      <CopyButton
        value={code}
        className={cn(
          "absolute right-4 top-4",
          withMeta && "top-16"
        )}
      />
    </div>
  )
}