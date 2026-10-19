import { PinIcon } from "lucide-react"

import { Marker, MarkerContent, MarkerIcon } from "@/registry/default/ui/marker"

export default function MarkerDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <PinIcon />
        </MarkerIcon>
        <MarkerContent>Pinned by Maya</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>3 unread messages</MarkerContent>
      </Marker>
    </div>
  )
}
