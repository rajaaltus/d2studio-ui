"use client"

import * as React from "react"
import { Check, Copy, Sparkles } from "reicon-react"

import { BeamButton, type BeamMotion } from "@/registry/default/components/button-beam"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

// One button on the stage in its default palette, so the beam and its cursor
// mirror read on their own. The panel beside it picks the motion and the
// cursor effect, and shows the usage line for exactly that choice, ready to
// copy. Bring the pointer near the button to see the reflection.
const BUTTON = { color: "ocean", mirror: "edge", label: "Get started", Icon: Sparkles, icon: "Sparkles" } as const

const MOTION_NAMES: Record<BeamMotion, string> = {
  line: "Line",
  rotate: "Rotate",
  breathe: "Breathe",
}

// Smoke rides on the reflection, so the cursor effect is one choice of three
// rather than two switches with a combination that cannot exist.
type Effect = "plain" | "reflection" | "smoke" | "shadow"

// The site's code theme, shiki's github-light-default / github-dark-default,
// token for token: this snippet is small and fixed in shape, so it is painted
// here rather than shipping shiki to the client.
const TOKEN = {
  text: "text-[#1F2328] dark:text-[#E6EDF3]",
  tag: "text-[#116329] dark:text-[#7EE787]",
  attr: "text-[#0550AE] dark:text-[#79C0FF]",
  eq: "text-[#CF222E] dark:text-[#FF7B72]",
  str: "text-[#0A3069] dark:text-[#A5D6FF]",
} as const

const T = ({ k, children }: { k: keyof typeof TOKEN; children: React.ReactNode }) => (
  <span className={TOKEN[k]}>{children}</span>
)

const Prop = ({ name, value }: { name: string; value: string }) => (
  <>
    {" "}
    <T k="attr">{name}</T>
    <T k="eq">=</T>
    <T k="str">&quot;{value}&quot;</T>
  </>
)

export default function ButtonBeamDemo() {
  const [effect, setEffect] = React.useState<Effect>("shadow")
  const [motion, setMotion] = React.useState<BeamMotion>("rotate")
  const reflect = effect !== "plain"
  const smoke = effect === "smoke"
  const shadow = effect === "shadow"
  const [copied, setCopied] = React.useState(false)
  const { color, mirror, label, Icon, icon } = BUTTON

  const usage = `<BeamButton size="lg" color="${color}"${motion !== "line" ? ` motion="${motion}"` : ""}${reflect ? ` mirror="${mirror}"` : ""}${smoke ? " smoke" : ""}${shadow ? " shadow" : ""}>
  <${icon} weight="Filled" />
  ${label}
</BeamButton>`

  const copy = async () => {
    await navigator.clipboard.writeText(usage)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    // One bento card filling the frame (its height less the stage's padding):
    // the button's stage, and its options in a panel beside it, or under it
    // when the card is narrow. A hairline ring 2px out from the card, radii
    // concentric (14 = 12 + 2).
    <div className="@container flex min-h-[calc(100svh-2rem)] w-full rounded-[14px] border border-border/60 p-0.5 sm:min-h-[calc(100svh-4rem)]">
      <div className="grid flex-1 grid-cols-1 grid-rows-[1fr_auto] overflow-hidden rounded-xl border bg-muted/30 @3xl:grid-cols-[minmax(0,1fr)_26rem] @3xl:grid-rows-1">
      <div className="flex min-h-28 items-center justify-center">
        <BeamButton size="lg" color={color} motion={motion} mirror={reflect ? mirror : false} smoke={smoke} shadow={shadow}>
          <Icon weight="Filled" />
          {label}
        </BeamButton>
      </div>

      <div className="flex flex-col justify-center gap-3 border-t p-4 @3xl:border-t-0 @3xl:border-l">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Select value={motion} onValueChange={(v) => setMotion(v as BeamMotion)}>
              <SelectTrigger size="sm" aria-label="Animation" className="min-w-0 flex-[2]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(MOTION_NAMES) as BeamMotion[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {MOTION_NAMES[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={effect} onValueChange={(v) => setEffect(v as Effect)}>
              <SelectTrigger size="sm" aria-label="Cursor effect" className="min-w-0 flex-[3]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plain">Plain cursor</SelectItem>
                <SelectItem value="reflection">Reflection</SelectItem>
                <SelectItem value="smoke">Reflection + smoke</SelectItem>
                <SelectItem value="shadow">Reflection + shadow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-background/60">
          {/* Copy sits in its own bar, so it never covers a long line. */}
          <div className="flex h-8 items-center justify-between border-b pr-0.5 pl-3">
            <span className="text-xs text-muted-foreground">Usage</span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Copied" : "Copy usage"}
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-[color,background-color,scale] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.97]"
            >
              {copied ? <Check size={14} weight="Filled" /> : <Copy size={14} weight="Filled" />}
            </button>
          </div>
          <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed">
            <code>
              <T k="text">{"<"}</T>
              <T k="tag">BeamButton</T>
              <Prop name="size" value="lg" />
              <Prop name="color" value={color} />
              {motion !== "line" && <Prop name="motion" value={motion} />}
              {reflect && <Prop name="mirror" value={mirror} />}
              {(smoke || shadow) && (
                <>
                  {" "}
                  <T k="attr">{smoke ? "smoke" : "shadow"}</T>
                </>
              )}
              <T k="text">{">"}</T>
              {"\n  "}
              <T k="text">{"<"}</T>
              <T k="tag">{icon}</T>
              <Prop name="weight" value="Filled" />
              <T k="text">{" />"}</T>
              {"\n  "}
              <T k="text">{label}</T>
              {"\n"}
              <T k="text">{"</"}</T>
              <T k="tag">BeamButton</T>
              <T k="text">{">"}</T>
            </code>
          </pre>
        </div>
      </div>
      </div>
    </div>
  )
}
