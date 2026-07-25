import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// navigator.clipboard only exists in a secure context (https / localhost).
// Over plain http on a LAN IP — phones, other machines on the network — it is
// undefined, so every copy button silently dies. Fall back to execCommand.
export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text)
  }

  const el = document.createElement("textarea")
  el.value = text
  el.contentEditable = "true"
  el.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none"
  document.body.appendChild(el)

  // iOS Safari ignores select() on its own — it needs an explicit range.
  const range = document.createRange()
  range.selectNodeContents(el)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
  el.setSelectionRange(0, text.length)

  const ok = document.execCommand("copy")
  el.remove()
  if (!ok) throw new Error("Copy failed")
}
