"use client"

import * as React from "react"
import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string
  language?: string
  filename?: string
  withMeta?: boolean
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  withMeta = false,
  className,
  ...props
}: CodeBlockProps) {
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

      {/* Code content */}
      <pre
        className={cn(
          "relative overflow-x-auto py-4 text-sm",
          "max-h-[650px]",
          "[&_code]:grid [&_code]:min-w-full [&_code]:break-words [&_code]:rounded-none [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0",
          className
        )}
        {...props}
      >
        <code
          className="text-zinc-50"
          data-language={language}
        >
          {code.split('\n').map((line, index) => (
            <span
              key={index}
              // pr clears the copy button, which floats over the code at
              // right-4 and otherwise sits on top of any line long enough to
              // reach it.
              className="block min-h-[1rem] py-0.5 pl-4 pr-14"
              data-line={index + 1}
            >
              {line || ' '}
            </span>
          ))}
        </code>
      </pre>

      {/* Copy button */}
      <CopyButton
        value={code}
        className={cn(
          // Opaque, because a line longer than the block scrolls *under* the
          // button — right padding only moves the line's end, which is already
          // off-screen. The backdrop is what keeps the icon readable.
          "absolute right-3 top-3 bg-zinc-950 dark:bg-zinc-900",
          withMeta && "top-16"
        )}
      />
    </div>
  )
}