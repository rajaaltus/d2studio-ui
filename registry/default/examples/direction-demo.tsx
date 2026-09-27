"use client"

import * as React from "react"

import { Button } from "@/registry/default/ui/button"
import { DirectionProvider } from "@/registry/default/ui/direction"
import { Slider } from "@/registry/default/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/registry/default/ui/tabs"

export default function DirectionDemo() {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("rtl")
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Button variant="outline" size="sm" className="self-start" onClick={() => setDir(dir === "rtl" ? "ltr" : "rtl")}>
        Switch to {dir === "rtl" ? "LTR" : "RTL"}
      </Button>
      <DirectionProvider dir={dir}>
        <div dir={dir} className="flex flex-col gap-6">
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">{dir === "rtl" ? "الحساب" : "Account"}</TabsTrigger>
              <TabsTrigger value="two">{dir === "rtl" ? "الأمان" : "Security"}</TabsTrigger>
              <TabsTrigger value="three">{dir === "rtl" ? "الفواتير" : "Billing"}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Slider defaultValue={[30]} max={100} step={1} />
        </div>
      </DirectionProvider>
    </div>
  )
}
