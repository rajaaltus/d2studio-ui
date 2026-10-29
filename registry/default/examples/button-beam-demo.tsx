"use client"

import * as React from "react"
import { Check, Copy, Play, Sparkles } from "reicon-react"

import { BeamButton } from "@/registry/default/components/button-beam"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select"

// One button on the stage, so the beam and its cursor mirror read on their
// own. The controls sit at the foot: a palette, the reflection on or off, and
// the usage line for exactly that choice, ready to copy. Bring the pointer
// near the button to see the reflection.
const VARIANTS = {
  ocean: { color: "ocean", mirror: "edge", label: "Get started", Icon: Sparkles, icon: "Sparkles" },
  mono: { color: "mono", mirror: "water", label: "Watch demo", Icon: Play, icon: "Play" },
} as const

type Variant = keyof typeof VARIANTS

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
  const [variant, setVariant] = React.useState<Variant>("ocean")
  const [effect, setEffect] = React.useState<Effect>("reflection")
  const reflect = effect !== "plain"
  const smoke = effect === "smoke"
  const shadow = effect === "shadow"
  const [copied, setCopied] = React.useState(false)
  const { color, mirror, label, Icon, icon } = VARIANTS[variant]

  const usage = `<BeamButton color="${color}"${reflect ? ` mirror="${mirror}"` : ""}${smoke ? " smoke" : ""}${shadow ? " shadow" : ""}>
  <${icon} weight="Filled" />
  ${label}
</BeamButton>`

  const copy = async () => {
    await navigator.clipboard.writeText(usage)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-between gap-8 py-2">
      <div className="flex flex-1 items-center">
        <BeamButton color={color} mirror={reflect ? mirror : false} smoke={smoke} shadow={shadow}>
          <Icon weight="Filled" />
          {label}
        </BeamButton>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Select value={variant} onValueChange={(v) => setVariant(v as Variant)}>
            <SelectTrigger size="sm" aria-label="Palette" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ocean">Ocean</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
            </SelectContent>
          </Select>
          <Select value={effect} onValueChange={(v) => setEffect(v as Effect)}>
            <SelectTrigger size="sm" aria-label="Cursor effect" className="w-44">
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

        <div className="relative w-[min(100%,26rem)] rounded-lg border bg-muted/50">
          <pre className="overflow-x-auto px-3 py-2.5 pr-10 font-mono text-xs leading-relaxed">
            <code>
              <T k="text">{"<"}</T>
              <T k="tag">BeamButton</T>
              <Prop name="color" value={color} />
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
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Copied" : "Copy usage"}
            className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check size={14} weight="Filled" /> : <Copy size={14} weight="Filled" />}
          </button>
        </div>
      </div>
    </div>
  )
}
